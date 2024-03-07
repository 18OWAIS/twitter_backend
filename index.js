
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());
console.log(process.env.MONGO_URI)

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {  
    serverApi: ServerApiVersion.v1});
 

async function run() {
    try {
        await client.connect();
        const postCollection = client.db("database").collection("posts"); // this collection is for team-ekt
        const userCollection = client.db("database").collection("users"); // this collection is for team-srv

        // get
        app.get('/user', async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        })
        app.get('/loggedInUser', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const user = await userCollection.find({ email: email }).toArray();
            console.log(user)
            res.send(user);
        })
        app.get('/post', async (req, res) => {
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
        })
        app.get('/userPost', async (req, res) => {
            const email = req.query.email;
            const post = (await postCollection.find({ email: email }).toArray()).reverse();
            res.send(post);
        })

        // post
        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })

        // patch
        app.patch('/userUpdates/:email', async (req, res) => {
            console.log("patch")
            const filter = req.params;
            const profile = req.body;
            const options = { upsert: true };
            const updateDoc = { $set: profile };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


    } catch (error) {
        console.log(error);
    }
} run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Twitter Clone!')
})

app.listen(port, () => {
    console.log(`Twitter clone is listening on port ${port}`)
})