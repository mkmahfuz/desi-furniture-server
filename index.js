const express = require('express');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectID; //this is needed to delete from mongodb or get single object

require('dotenv').config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const port = process.env.PORT || 5050;

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

//mongodb connection
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.lroqv.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 40000, keepAlive: 1 });

//api for mongodb related collections
client.connect(err => {
    console.log("DB ERROR:", err);
    console.log("mongodb connected: OK");
    const servicesCollection = client.db("desifurniture").collection("services");
    const ordersCollection = client.db("desifurniture").collection("orders");
    const reviewsCollection = client.db("desifurniture").collection("reviews");
    const adminUsersCollection = client.db("desifurniture").collection("admins");

    // perform actions on the collection object

    //GET : get all servicess from services collection objects
    app.get('/allServices', (req, res) => {
        servicesCollection.find({}).toArray()
            .then((items) => {
                //console.log("All-Services: ", items);
                res.send(items);
            })
    })

    //GET : get single service from database
    app.get('/service/:id', (req, res) => {
        const objId = req.params.id;
        servicesCollection.find({ _id: ObjectId(objId) }).toArray()
            .then((doc) => {
                res.send(doc[0]);
            })
    })


    //POST : add one service to services collection objects 
    app.post('/addService', (req, res) => {
        const newService = req.body;
        // console.log(newService);
        servicesCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount);
            })
    })

    //POST : add one order to orders collection objects
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        //console.log(newOrder);
        ordersCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount);
            })
    })
    //POST : add one review to reviews collection objects
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        //console.log(newReview);
        reviewsCollection.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount);
            })
    })
    //GET : get all servicess from services collection objects
    app.get('/allReviews', (req, res) => {
        reviewsCollection.find({}).toArray()
            .then((items) => {
                //console.log("All-Services: ", items);
                res.send(items);
            })
    })

    //GET : get all orders for specific user  from orders collection object
    app.get('/orders', (req, res) => {
        const userEmail = req.query.email;
        //console.log(userEmail);
        ordersCollection.find({ email: userEmail }).toArray()
            .then((docs) => {
                res.send(docs);
            })
    })


    //GET : get all orders from orders collection objects -for admin only
    app.get('/allOrders', (req, res) => {
        ordersCollection.find({}).toArray()
            .then((items) => {
                //console.log("All-Orders: ", items);
                res.send(items);
            })
    })


    //DELETE : delete one service from services collection objects
    app.delete('/deleteService/:id', (req, res) => {
        const objId = req.params.id;
        servicesCollection.deleteOne({ _id: ObjectId(objId) })
            .then((result) => {
                console.log(result);
                res.send(result.deletedCount > 0); //delete is successfull 
            })
        //console.log(req.params.id)
    })


    //update order status 
    app.patch('/updateOrder/:id', (req, res) => {
        console.log(req.body.status);
        ordersCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: { status: req.body.status}
            }
        )
        .then(result=>{
            res.send(result.modifiedCount > 0); //update is successfull 
            
        })
    })

    //POST : add adminuser to adminusers collection objects
    app.post('/addAdmin', (req, res) => {
        
        const newAdmin = req.body;
        //console.log(newReview);
        adminUsersCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount);
            })
    })

    //GET : get all admin users from admins collection objects -for admin only
    app.get('/alladmins', (req, res) => {
        adminUsersCollection.find({}).toArray()
            .then((items) => {
                //console.log("All-admins: ", items);
                res.send(items);
            })
    })

    //GET : get specific admin user  from adminusers collection object
    app.get('/adminuser', (req, res) => {
        const userEmail = req.query.email;
        console.log(userEmail);
        adminUsersCollection.find({ email: userEmail }).toArray()
            .then((docs) => {
                res.send(docs);
            })
    })
    //Others TODO:

    //client.close();
});
