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

        //Get Api    
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // Get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // Post api
        app.post('/services', async (req, res) => {

            const service = req.body;

            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);

            res.json(result);
        })

        // Delete api
        app.delete('/services/:id', async (req, res) => {
            console.log('hitting delete')
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
})

app.listen(port, () => {
    console.log('Running Genius Server on Port', port)
})