const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB database
mongoose.connect('mongodb+srv://shuklaaashish90:Aman123@mydatabase.jx3c3fn.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase', {}).then(() => {
  console.log("Connected to MongoDB database");
}).catch((err) => {
  console.error("Error connecting to MongoDB database:", err);
});

// Define mongoose schema and model for products
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  artisan: String,
  category: String // Add category field to the schema
});

// Define a single model for all products
const Product = mongoose.model('Product', productSchema);

// Create an instance of express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get products by category
app.get('/api/products/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a new product
app.post('/api/products', async (req, res) => {
  const { name, price, artisan, category } = req.body;
  try {
    const newProduct = new Product({ name, price, artisan, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
