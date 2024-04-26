// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');

// // Connect to MongoDB database
// mongoose.connect('mongodb+srv://shuklaaashish90:Aman123@mydatabase.jx3c3fn.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase', {}).then(() => {
//     console.log("Connected to MongoDB database");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB database:", err);
// });

// // Define mongoose schema and model for products
// const productSchema = new mongoose.Schema({
//     name: String,
//     price: Number,
//     artisan: String,
//     category: String,
//     imageUrl: String // Add imageUrl field to the schema
// });

// const Product = mongoose.model('Product', productSchema);

// // Create an instance of express app
// const app = express();

// // Middleware to parse JSON and URL-encoded bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); // Add this line

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // Multer configuration for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/assets'); // Save uploaded files to the 'public/assets' directory
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to filename to ensure uniqueness
//     }
// });

// const upload = multer({ storage: storage });

// // Route to get all products
// app.get('/api/products', async (req, res) => {
//     try {
//         let query = {};
//         if (req.query.category) {
//             query = { category: req.query.category };
//         }
//         const products = await Product.find(query);
//         res.json(products);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Route to add a new product
// app.post('/api/products', upload.single('product-image'), async (req, res) => {
//     const { name, price, artisan, category } = req.body; // Include other product fields
//     const imageUrl = req.file ? '/assets/' + req.file.filename : ''; // Extract uploaded image filename
//     try {
//         const newProduct = new Product({ name, price, artisan, category, imageUrl });
//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.error("Error adding product:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

// Connect to MongoDB database for products
mongoose.connect('mongodb+srv://shuklaaashish90:Aman123@mydatabase.jx3c3fn.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase', {}).then(() => {
    console.log("Connected to MongoDB database for products");
}).catch((err) => {
    console.error("Error connecting to MongoDB database for products:", err);
});

// Define mongoose schema and model for products
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    artisan: String,
    category: String,
    imageUrl: String // Add imageUrl field to the schema
});

const Product = mongoose.model('Product', productSchema);

// Connect to MongoDB database for users
mongoose.connect('mongodb+srv://shuklaaashish90:Aman123@mydatabase.jx3c3fn.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase', {}).then(() => {
    console.log("Connected to MongoDB database for users");
}).catch((err) => {
    console.error("Error connecting to MongoDB database for users:", err);
});

// Define mongoose schema and model for users
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Create an instance of express app
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets'); // Save uploaded files to the 'public/assets' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to filename to ensure uniqueness
    }
});

const upload = multer({ storage: storage });

// Route to get all products
app.get('/api/products', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query = { category: req.query.category };
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to add a new product
app.post('/api/products', upload.single('product-image'), async (req, res) => {
    const { name, price, artisan, category } = req.body;
    const imageUrl = req.file ? '/assets/' + req.file.filename : '';
    try {
        const newProduct = new Product({ name, price, artisan, category, imageUrl });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route for user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.redirect('/index.html'); // Redirect to index.html upon successful login
            } else {
                res.status(401).send('Invalid username or password');
            }
        } else {
            res.status(401).send('User not found');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route for user signup
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/index.html'); // Redirect to index.html upon successful signup
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to serve auth.html initially
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/auth.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
