const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Added ObjectId here
const app = express();
const port = process.env.PORT || 5000;

// cors middleware
app.use(cors());
app.use(express.json());

// mongodb connection 
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // JWT token for authentication
    app.post('/login', (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    });

    // Slider data API
    app.get('/slider', async (req, res) => {
      const slider = await client.db("Content").collection("slider-data").find({}).toArray();
      res.json(slider);
    });

    // All products API
    app.get('/products', async (req, res) => {
      const products = await client.db("Content").collection("all-products").find({}).toArray();
      res.json(products);
    });

    // Product by ID API
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // ObjectId is now defined
      const product = await client.db("Content").collection("all-products").findOne(query);
      res.json(product);
    });


    // Cart API

    // Get all cart items
    app.get('/cart', async (req, res) => {
      const cart = await client.db("Content").collection("cart").find({}).toArray();
      res.json(cart);
    });

    // Add item to cart
    app.post('/cart', async (req, res) => {
      const cartItem = req.body;
      const result = await client.db("Content").collection("cart").insertOne(cartItem);
      res.json(result);
    });

    // Delete item from cart
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await client.db("Content").collection("cart").deleteOne(query);
      res.json(result);
    });
    
    // update cart item
    // app.put('/cart/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const cartUpadte = req.body;
    //   console.log(cartUpadte);
    //   const query = { _id: new ObjectId(id) };
    //   const updateDoc = {
    //     $set: {
    //       quantity: req.body.quantity,
    //     },
    //   };
    //   const result = await client.db("Content").collection("cart").updateOne(query, updateDoc);
    //   res.json(result);
    // });

    // promo code API

    // Get all promo codes
app.get('/promo-codes', async (req, res) => {
  try {
    const promoCodes = await client.db("Content").collection("promo-codes").find({}).toArray();
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

// Add promo code
app.post('/promo-codes', async (req, res) => {
  try {
    const promoCode = req.body;
    if (!promoCode.code || !promoCode.discountPercent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await client.db("Content").collection("promo-codes").insertOne(promoCode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add promo code' });
  }
});

    // Ad banner API
    app.get('/ad-banner', async (req, res) => {
      const adBanner = await client.db("Content").collection("ad-bennar").find({}).toArray();
      res.json(adBanner);
    });

    // Testimonials API
    app.get('/testimonials', async (req, res) => {
      const testimonials = await client.db("Content").collection("testimonials").find({}).toArray();
      res.json(testimonials);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); // Commented out to keep the connection alive for the server
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});