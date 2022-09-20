const { MongoClient } = require("mongodb");
const express = require("express");
const path = require("path");
const cors = require("cors");
var bodyParser = require('body-parser');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })

require("dotenv").config();

const uri = process.env.URI;
const client = new MongoClient(uri);
const database = client.db("NVCTI");
const collection = database.collection("event");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, '../build/static')));
app.get('/event', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
});
app.post("/event/submit", (req, res) => {
    if (!req.body) {
        req.body = {};
    }
    req.body["Event"] = "1";
    console.log(req.body);
    collection.findOneAndReplace({ "Event": "1" }, req.body).then((resp) => {
        res.send(resp);
    })
})
app.get("/event/formData", (req, res) => {
    collection.findOne({ "Event": "1" }).then((resp) => {
        res.send(resp);
    })
})

app.get("/event/apply", (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
})

app.post("/event/submitForm", upload.array("files", 10), (req, res) => {
    let data = {}
    console.log(req.body);
    collection.findOne({ "Event": "1" }).then((resp) => {
        data = resp;
        if (!data["applicants"]) {
            data["applicants"] = []
        }
        data["applicants"].push(req.body);
        collection.findOneAndReplace({ "Event": "1" }, data).then((resp) => {
            res.send(resp);
        })
    })
})

app.listen(5000, () => {
    console.log("server started");
});