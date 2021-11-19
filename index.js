const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//  middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufevr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Connect to Database');
        const database = client.db("servicesDetails");
        const servicesCollection = database.collection("services");
        const servicesOrder = database.collection('Order')


        // Post api services add success
        app.post('/servicesadd', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //Get Api  data load  ui
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //order to server add
        app.post('/order', async (req, res) => {
            console.log('database hot Order')
            const order = req.body;
            const result = await servicesOrder.insertOne(order);
            res.json(result)
        });

        //All Order Manages
        app.get('/allorder', async (req, res) => {
            const cursor = servicesOrder.find();
            const allOrder = await cursor.toArray();
            res.json(allOrder);
        })

        //My Order manage ui show
        app.get('/order',  async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = servicesOrder.find(query);
            const order = await cursor.toArray();
            res.json(order);
        })



       

        // Delete api
        app.delete('/order/:id', async (req, res) => {
            console.log('hitting delete')
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await servicesOrder.deleteOne(query);
            res.json(result)
        })



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Amra Fast');
})

app.listen(port, () => {
    console.log('Running Amra Fast Server on Port !', port)
})