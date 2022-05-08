const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        
        //Get method gets all Products or by size limit 
        app.get('/products',async(req,res)=>{
            const size = req.query.size;
            const query = {};
            const products = productCollection.find(query);

            if(size){
                result = await products.limit(size).toArray;
            }
            else{
                result = await products.toArray(); 
            }
            res.send(result);
        });

        //Get method find single product
        app.get('/product/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });
        //POST method add new product
        app.post('/product', async(req,res)=>{
            const newProduct = req.body;
            const result = productCollection.insertOne(newProduct);
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Watch House server is running...");
});

app.listen(port,()=>{
    console.log('Port: '+port+" is running");
})
