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
const mentorCollection = database.collection("mentors");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, '../build/static')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')))

const user = "admin";

//ADMIN
app.get('/event/:id/makeForm', (req, res) => {
    if (user == "admin") {
        res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
    } else {
        res.send("You are not allowed to view this page");
    }
});

//ADMIN
app.post("/event/:id/submit", (req, res) => {
    if (user == "admin") {
        collection.findOne({ "Event": req.params.id }).then((resp) => {
            resp["questions"] = req.body.questions;
            collection.findOneAndReplace({ "Event": req.params.id }, resp).then((resp) => {
                res.redirect("/allevents");
            })
        })
    } else {
        res.send("You are not allowed to view this page");
    }
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
    var eFlag = 0;

    for (var key of Object.keys(req.body)) {
        if (key != "files" && req.body[key].trim() == "") {
            eFlag = 1;
            return res.send("error");
        }
    }

    let data = {}
    
    if (req.files.length != 0) {
        let files = {}
        for (var f of req.files) {
            files[f["fieldname"]] = f["filename"];
        }
        req.body["files"] = files;
    }

    collection.findOne({ "Event": req.params.id }).then((resp) => {
        data = resp;
        var eFlag = 0;
        if (!data["applicants"]) {
            data["applicants"] = []
        }
        req.body["status"] = "pending";
        data["applicants"].push(req.body);

        collection.findOneAndReplace({ "Event": req.params.id }, data).then((resp) => {
            res.redirect("/allevents");
        })
    })
})

//ADMIN
app.get("/event/:id/view", (req, res) => {
    if (user == "admin") {
        res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
    } else {
        res.send("You are not allowed to view this page");
    }
})

//ADMIN
app.get("/event/:id/data", (req, res) => {
    if (user == "admin") {
        collection.findOne({ "Event": req.params.id }).then((resp) => {
            res.json(resp);
        })
    } else {
        res.send("You are not allowed to view this page");
    }
})

//ADMIN
app.get('/createEvent', (req, res) => {
    if (user == "admin") {
        res.sendFile('index.html', {root: path.join(__dirname, '../build/')});
    } else {
        res.send("You are not allowed to view this page");
    }
})

//ADMIN
app.post("/createEvent", (req, res) => {
    if (user == "admin") {
        collection.countDocuments({ "_id": { "$exists": true } }).then((resp) => {
            req.body["Event"] = (resp + 1).toString();
            req.body["isOngoing"] = false;
            req.body["comps"] = {"elements": {}};
            collection.insertOne(req.body).then(() => {
                res.send("Done");
            })
        })
    } else {
        res.send("You are not allowed to view this page");
    }
})

//ADMIN
app.post("/event/:id/updatestatus", (req, res) => {
    if (user == "admin") {
        collection.findOne({ "Event": req.params.id }).then((resp) => {
            resp.applicants[req.body.studId].status = req.body.status;
            collection.findOneAndReplace({ "Event": req.params.id }, resp).then((resp) => {
                res.send("Updated");
            })
        })
    } else {
        res.send("You are not allowed to view this page");
    }
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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//ADMIN
app.post("/sendmentor", (req, res) => {
    const mentorMail = req.body.emailID;
    const applicants = req.body.applicants;
    const mentorID = Date.now();
    const password = makeid(16);
    const data = {id: mentorID.toString(), mail: mentorMail, applicants: applicants}

    mentorCollection.insertOne(data);

    res.json(data);
})

//MENTOR
app.get("/mentor/:id/view", (req, res) => {
    const mentorID = req.params.id;
    mentorCollection.findOne({ "id": mentorID }).then((resp) => {
        res.json(resp);
    })
})

//MENTOR
app.post("/mentor/:id/update", (req, res) => {
    const applicantID = req.body.applicantID;
    
    mentorCollection.findOne({ "id": req.params.id }).then((resp) => {
        resp.applicants[applicantID].status = req.body.status;
        mentorCollection.findOneAndReplace({ "id": req.params.id }, resp).then((resp) => {
            res.send(resp);
        })
    })
})

app.listen(5000, () => {
    console.log("server started");
});