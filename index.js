const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const verify = require("jsonwebtoken/verify");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function verifyJWT(req,res,next){
    const authHeader =req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: "Unauthorized access."});
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decode)=>{
        if(err){
            return res.status(403).send({message: 'Access Denied !!'})
        }
        console.log('decode:',decode);
        next();
    })
}

// const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.okzxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri =
  "mongodb+srv://papai:papai757@cluster0.okzxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("watchHouse").collection("products");
    const reviewCollection = client
      .db("watchHouse")
      .collection("customerReview");


    app.post('/login', async(req,res)=>{
        const user = req.body;
        console.log(user);
        const token =jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

        res.send({token});
    })
    //Get method gets all Products or by size limit or email
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const size = parseInt(req.query.size);
      // console.log("req:",req.query.size);
      // console.log("size:",size);
      let query = {};

      if (email) {
        query = { email };
      }
      const products = productCollection.find(query);

      if (size) {
        result = await products.limit(size).toArray();
      } else {
        result = await products.toArray();
      }
      res.send(result);
    });

    //Get method find single product
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
    //POST method add new product
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = productCollection.insertOne(newProduct);
      res.send(result);
    });

    //DELETE method , delete a product
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //DELETE method , delete a product
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      // create a document that sets the plot of the movie
      const updateDoc = {
        $set: {
          plot: `A harvest of random numbers, such as: ${Math.random()}`,
        },
      };
      const result = await movies.updateOne(filter, updateDoc, options);
    });

    //Get method gets all review
    app.get("/reviews", async (req, res) => {
      const size = parseInt(req.query.size);
      const query = {};
      const reviews = reviewCollection.find(query);
      if (size) {
        result = await reviews.limit(size).toArray();
      } else {
        result = await reviews.toArray();
      }
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Watch House server is running...");
});

app.listen(port, () => {
  console.log("Port: " + port + " is running");
});
