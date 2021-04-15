const express = require('express');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectID; //this is needed to delete from mongodb or get single object

require('dotenv').config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const port = process.env.PORT || 6060;

app.use(express.json());
app.use(express.urlencoded()); // need this for getting form data
app.use(cors());

app.listen(port, () => {
    console.log("I am listening on port : ", port);
})


//general api not database related. 
app.get('/', (req, res) => {
    res.send("This is the server root, Howdy mkm")
})

app.get('/test', (req, res) => {
    res.send("This is a get test request")
})