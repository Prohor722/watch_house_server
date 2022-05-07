const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


// const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.okzxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = "mongodb+srv://papai:papai757@cluster0.okzxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
         await client.connect();
        const productCollection = client.db("watchHouse").collection("products");
        const reviewCollection = client.db("watchHouse").collection("customerReview");

        app.get('/',(req,res)=>{
            res.send("Watch House server is running...");
        });
        
        //Products 
        app.get('/products',async(req,res)=>{
            const query = {};
            const products = productCollection.find(query);
            const result = await products.toArray(); 
            res.send(result);
        });

        app.get('/reviews',async(req,res)=>{
            const query = {};
            const reviews = reviewCollection.find(query);
            const result = await reviews.toArray(); 
            res.send(result);
        });
    }
    finally{

    }
}

run().catch(console.dir);

app.listen(port,()=>{
    console.log('Port: '+port+" is running");
})
