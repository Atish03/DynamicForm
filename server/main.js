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
    collection.findOne({ "Event": req.params.id }).then((resp) => {
        resp["comps"] = req.body.comps;
        collection.findOneAndReplace({ "Event": req.params.id }, resp).then((resp) => {
            res.send(resp);
        })
    })
})

app.get("/event/:id/formData", (req, res) => {

    collection.findOne({ "Event": req.params.id }).then((resp) => {
        resp["eventID"] = req.params.id;
        res.send(resp);
    }).catch((error) => {
        console.error(error);
        res.send("err404")
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
        req.body["status"] = "pending";
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

//ADMIN
app.get('/createEvent', (req, res) => {
    res.sendFile("index.html", {root: path.join(__dirname, "../build/")});
})

//ADMIN
app.post("/createEvent", (req, res) => {
    collection.countDocuments({ "_id": { "$exists": true } }).then((resp) => {
        req.body["Event"] = (resp + 1).toString();
        req.body["isOngoing"] = false;
        req.body["comps"] = {"elements": {}};
        collection.insertOne(req.body).then(() => {
            res.send("Done");
        })
    })
})

//ADMIN
app.post("/event/:id/updatestatus", (req, res) => {
    collection.findOne({ "Event": req.params.id }).then((resp) => {
        resp.applicants[req.body.studId].status = req.body.status;
        collection.findOneAndReplace({ "Event": req.params.id }, resp).then((resp) => {
            res.send("Updated");
        })
    })
})

app.get("/event", (req, res) => {
    res.sendFile("index.html", {root: path.join(__dirname, "../build/")});
})

app.get("/allevents", (req, res) => {
    collection.find({}).toArray((err, result) => {
        fResult = {};
        for(var i = 0; i < result.length; i++) {
            temp = {}
            temp["Name"] = result[i].eventName;
            temp["Organizer"] = result[i].eventOrganizer;
            temp["EventID"] = result[i].Event;
            fResult[i] = temp;
        }
        res.json(fResult);
    });
})

app.listen(5000, () => {
    console.log("server started");
});