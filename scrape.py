import requests, bs4, json




def dataCleanup():
    with open("data.json", "r+") as file:
        data = json.load(file)
    for category in data:
        for item in data[category]:
            item['category'] = category

            item['img'] = item['img'].split('?')[0]

            for stat in item.get('stats', []):
                item[stat.lower()] = item['stats'][stat]

            item.pop('stats', None)

    with open("data.json", "w+") as file:
        json.dump(data, file)

def databankHTMLtoJSON(url):
    r = requests.get(url)
    soup = bs4.BeautifulSoup(r.content, 'html.parser')
    title = soup.select_one('.long-title').get_text()
    desc = soup.select_one('.desc').get_text()
    img = soup.select_one('.thumb').get('src')
    statsCategories = soup.select('.stats-container .category')
    statDict = {}
    for stat in statsCategories:
        statName = stat.select_one('.heading').get_text()
        statItems = stat.select('.data')
        statItemsList = []
        for statItem in statItems:
            link = statItem.select_one('a')
            if link == None:
                ref = None
            else:
                link = link.get('href')
                ref = link.split('/')[4]
            name = statItem.get_text().replace('                  ', '').replace('\n', '').replace('                ', '').replace(',', '')
            statItemDict = {
                "ref": ref,
                "name": name
            }
            statItemsList.append(statItemDict)
        if statItemsList != []:
            statDict[statName] = statItemsList

    return {
        "id": url.split('/')[4],
        "title": title,
        "desc": desc,
        "img": img,
        "stats": statDict
    }

def retrieveDatabank():
    categories = ['Characters', 'Creatures', 'Droids', 'Locations', 'Organizations', 'Species', 'Vehicles', 'Weapons%2BTech&', 'More']
    # categories = ['Characters']
    categoriesData = {}
    for category in categories:
        url = 'https://www.starwars.com/_grill/filter/databank?filter={}&mod=5'.format(category)
        categoryItems = []
        nextPage = True
        while nextPage:
            r = requests.get(url)
            data = r.json()
            categoryTitle = data['title']
            print(categoryTitle)
            for item in data['data']:
                categoryItems.append(databankHTMLtoJSON(item['href']))
            if 'next' not in data:
                nextPage = False
                url = None
            else:
                url = 'https://www.starwars.com/_grill/filter/databank' + data['next']
        categoriesData[categoryTitle] = categoryItems

    with open("data.json", "w+") as file:
        json.dump(categoriesData, file)

retrieveDatabank()
dataCleanup()