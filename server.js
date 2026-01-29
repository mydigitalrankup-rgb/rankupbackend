// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

dotenv.config();

const app = express();


console.log("JWT SECRET:", process.env.JWT_SECRET);

// ================= MIDDLEWARE =================

// const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// app.use(cors({
//     origin: clientOrigin,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// }));


app.use(express.json());



// ================= DB =================

console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB error:', err));



// ================= SCHEMAS =================

// Contact
const contactSchema = new mongoose.Schema({
    fullName: String,
    businessName: String,
    email: String,
    phone: String,
    projectDetails: String,
    services: [String],
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);


// Advice
const adviceSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Advice = mongoose.model('Advice', adviceSchema);


// Admin
const adminSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);


// Blog
const blogSchema = new mongoose.Schema({

    title: { type: String, required: true },

    slug: { type: String, unique: true },

    description: { type: String, required: true },

    content: { type: String, required: true },

    image: String,

    category: String,

    status: {
        type: String,
        enum: ['draft', 'publish'],
        default: 'publish'
    }

}, { timestamps: true });


const Blog = mongoose.model('Blog', blogSchema);



// ================= AUTH MIDDLEWARE =================

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token required' });


    jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key',
        (err, user) => {

            if (err) return res.status(403).json({ message: 'Invalid token' });

            req.user = user;
            next();
        }
    );
};



// ================= REGEX =================

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+?\d{1,3}[-\s]?)?\d{10}$/;



// ================= ADMIN DASHBOARD STATS =================

app.get('/api/admin/stats', authenticateToken, async (req, res) => {

  try {

    const totalBlogs = await Blog.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalAdvices = await Advice.countDocuments();

    res.status(200).json({
      totalBlogs,
      totalContacts,
      totalAdvices
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({ message: 'Server error' });
  }
});



// ================= CONTACT =================

app.post('/api/contact', async (req, res) => {

    try {

        const { fullName, email, phone } = req.body;

        if (!fullName || !email || !phone) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone' });
        }

        const contact = new Contact(req.body);

        await contact.save();

        res.status(201).json({ message: 'Contact saved' });

    } catch (err) {

        console.log(err);

        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/contacts', async (req, res) => {

    const data = await Contact.find().sort({ createdAt: -1 });

    res.json(data);
});



// ================= ADVICE =================

app.post('/api/advice', async (req, res) => {

    try {

        const advice = new Advice(req.body);

        await advice.save();

        res.status(201).json({ message: 'Advice saved' });

    } catch (err) {

        console.log(err);

        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/advices', async (req, res) => {

    const data = await Advice.find().sort({ createdAt: -1 });

    res.json(data);
});



// ================= ADMIN =================

app.post('/api/admin/create', async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const exist = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (exist) {
            return res.status(400).json({ message: 'Admin exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        const admin = new Admin({
            username,
            email,
            password: hash
        });

        await admin.save();

        res.status(201).json({ message: 'Admin created' });

    } catch (err) {

        console.log(err);

        res.status(500).json({ message: 'Server error' });
    }
});


// app.post('/api/admin/create', async (req, res) => 
// { // try { // // 🔒 Fixed admin data (tu change kar sakda) 
// // const username = "superadmin"; 
// // const email = "admin@gmail.com";
// 
 // const plainPassword = "Admin@123";
 //  // // Check if admin already exists
 // 
  // const existingAdmin = await Admin.findOne({ // $or: [{ username }, { email }] // }); 
  // // if (existingAdmin) { // return res.status(400).json({ // message: "Admin already exists" // }); // }


    // app.post('/api/admin/login', async (req, res) => {

    //     try {

    //         const { username, password } = req.body;

    //         const admin = await Admin.findOne({ username });

    //         if (!admin) {
    //             return res.status(401).json({ message: 'Invalid login' });
    //         }

    //         const ok = await bcrypt.compare(password, admin.password);

    //         if (!ok) {
    //             return res.status(401).json({ message: 'Invalid login' });
    //         }

    //         const token = jwt.sign(
    //             { id: admin._id, role: admin.role },
    //             process.env.JWT_SECRET || 'secret',
    //             { expiresIn: '24h' }
    //         );

    //         res.json({ token });

    //     } catch (err) {

    //         console.log(err);

    //         res.status(500).json({ message: 'Server error' });
    //     }
    // });





    app.post('/api/admin/login', async (req, res) => {

  try {

    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid login' });
    }

    const ok = await bcrypt.compare(password, admin.password);

    if (!ok) {
      return res.status(401).json({ message: 'Invalid login' });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        username: admin.username
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );


    // ✅ SEND ADMIN DATA ALSO
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({ message: 'Server error' });
  }
});



    // ================= BLOG =================


    // CREATE
    app.post('/api/blog/create', async (req, res) => {

        try {

            const { title, description, content } = req.body;

            if (!title || !description || !content) {
                return res.status(400).json({ message: 'Missing fields' });
            }

            const slug = slugify(title, { lower: true });

            const blog = new Blog({
                ...req.body,
                slug
            });

            await blog.save();

            res.json({
                success: true,
                message: 'Blog created'
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({ message: 'Server error' });
        }
    });


    // ALL
    app.get('/api/blog', async (req, res) => {

        const blogs = await Blog.find({ status: 'publish' })
            .sort({ createdAt: -1 });

        res.json(blogs);
    });







    // GET BLOG BY ID (ADMIN EDIT)
    // GET BLOG BY ID (FOR EDIT ADMIN)
    app.get('/api/blog/id/:id', async (req, res) => {

        try {

            const blog = await Blog.findById(req.params.id);

            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            res.json(blog);

        } catch (err) {

            console.log(err);

            res.status(500).json({ message: 'Server error' });
        }
    });



    // SINGLE
    app.get('/api/blog/:slug', async (req, res) => {

        const blog = await Blog.findOne({ slug: req.params.slug });

        res.json(blog);
    });


    // UPDATE BLOG
    app.put('/api/blog/:id', async (req, res) => {

        try {

            const { title, description, content, image, category, status } = req.body;

            const updateData = {
                title,
                description,
                content,
                image,
                category,
                status
            };

            // Agar title change hua → slug update
            if (title) {
                updateData.slug = slugify(title, { lower: true });
            }

            const blog = await Blog.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            res.json({
                success: true,
                message: 'Blog updated',
                blog
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({ message: 'Server error' });
        }
    });


    // DELETE
    app.delete('/api/blog/:id', async (req, res) => {

        await Blog.findByIdAndDelete(req.params.id);

        res.json({ success: true });
    });



    // ================= HEALTH =================

    app.get('/health', (req, res) => {
        res.json({ status: 'OK' });
    });



    // ================= SERVER =================

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log('Server running on port', PORT);
    });
