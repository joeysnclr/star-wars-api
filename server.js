const express = require("express");
const cors = require("cors");
const app = express();
const dataFile = require("./data.json");

let data = dataFile;

app.use(cors());

app.get("/api", function (req, res) {
    let categories = [];
    for (const category of Object.keys(data)) {
        categories.push(category);
    }
    let media = {};
    for (const category of Object.keys(data)) {
        for (const item of data[category]) {
            for (const appearance of item.appearances || []) {
                if (!Object.keys(media).includes(appearance)) {
                    media[appearance.name] = appearance.ref;
                }
            }
        }
    }
    const help = {
        categories: categories,
        media: media,
        category: "/api/category/:category",
        item: "/api/id/:id",
        search: "/api/search/:query",
        appearances: "/api/appearances/:id",
    };
    res.json(help);
});

app.get("/api/category/:category", function (req, res) {
    const category = req.params.category;
    res.json(data[category]);
});

app.get("/api/id/:id", function (req, res) {
    const id = req.params.id;
    let result = {
        error: "id not found.",
    };
    for (const category of Object.keys(data)) {
        for (const item of data[category]) {
            if (item.id == id) {
                result = item;
            }
        }
    }
    res.json(result);
});

app.get("/api/search/:query", function (req, res) {
    const query = req.params.query.toLowerCase();
    let hits = [];
    for (const category of Object.keys(data)) {
        for (const item of data[category]) {
            if (item.title.toLowerCase().includes(query)) {
                hits.push(item);
            }
        }
    }
    res.json(hits);
});

app.get("/api/appearances/:id", function (req, res) {
    const id = req.params.id;
    let hits = [];
    for (const category of Object.keys(data)) {
        for (const item of data[category]) {
            if (Object.keys(item).includes("appearances")) {
                for (const appearance of item.appearances) {
                    if (appearance.ref == id) {
                        hits.push(item);
                    }
                }
            }
        }
    }
    res.json(hits);
});

app.listen(process.env.PORT || 8080);
