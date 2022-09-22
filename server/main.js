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
app.use('/uploads', express.static(path.join(__dirname, './uploads')))

//ADMIN
app.get('/event/:id/makeForm', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
});

//ADMIN
app.post("/event/:id/submit", (req, res) => {
    if (!req.body) {
        req.body = {};
    }
    req.body["Event"] = req.params.id;
    console.log(req.body);
    collection.findOneAndReplace({ "Event": req.params.id }, req.body).then((resp) => {
        res.send(resp);
    })
})

app.get("/event/:id/formData", (req, res) => {
    collection.findOne({ "Event": req.params.id }).then((resp) => {
        resp["eventID"] = req.params.id;
        res.send(resp);
    })
})

app.get("/event/:id/apply", (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
})

app.post("/event/:id/submitForm", upload.any(), (req, res) => {
    let data = {}
    let files = {}
    
    for (var f of req.files) {
        files[f["fieldname"]] = f["filename"];
    }

    collection.findOne({ "Event": req.params.id }).then((resp) => {
        data = resp;
        if (!data["applicants"]) {
            data["applicants"] = []
        }
        req.body["files"] = files;
        data["applicants"].push(req.body);
        collection.findOneAndReplace({ "Event": req.params.id }, data).then((resp) => {
            res.send(resp);
        })
    })
})

//ADMIN
app.get("/event/:id/view", (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
})

//ADMIN
app.get("/event/:id/data", (req, res) => {
    collection.findOne({ "Event": req.params.id }).then((resp) => {
        res.json(resp);
    })
})

app.listen(5000, () => {
    console.log("server started");
});