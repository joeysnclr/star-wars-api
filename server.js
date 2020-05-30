const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const fs = require('fs');
const dataFile = require('./data.json')


let data = dataFile;


app.get('/api', function (req, res) {
    let categories = [];
    for (const category of Object.keys(data)) {
        categories.push(category);
    }
    const help = {
        categories: categories,
        category: "/api/category/:category",
        item: "/api/id/:id",
        search: "/api/search/:query",
    }
    res.json(help);
});

app.get('/api/category/:category', function (req, res) {
    const category = req.params.category;
    res.json(data[category])
})

app.get('/api/id/:id', function (req, res) {
    const id = req.params.id;
    let result = {
        error: "id not found."
    }
    for (const category of Object.keys(data)) {
        for (const item of data[category]) {
            if (item.id == id) {
                result = item;
            }
        }
    }
    res.json(result)
})

app.get('/api/search/:query', function (req, res) {
    const category = req.params.category;
    const query = req.params.query.toLowerCase();
    let hits = [];
    for (const category of Object.keys(data)) {
        for (const item of data[category]) {
            if (item.title.toLowerCase().includes(query)) {
                hits.push(item)
            }
        }
    }
    res.json(hits)
})


app.listen(process.env.PORT || 8080);