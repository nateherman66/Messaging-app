const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const User = require("./models/User");
const auth = require("./middleware/auth");

app.use(cors());
app.use(express.json());

//console.log("URI:", process.env.MONGO_URI);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("Trying to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to database");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});


// respond with server running when a GET request is sent
app.get("/", (req, res) => {
    res.send("server running");
});

app.get("/profile", auth, async (req, res) => {
    const user = await User.findById(req.user.userID);

    res.json({
        email: user.email
    });
});


app.post("/signup", async (req, res) => {
    try {
    const {username, email, password} = req.body;
    const existingUser = await User.findOne({email});

    if (existingUser) {
        return res.status(400).json({
            message: "Email already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
    });
    
    await user.save();

    res.json({
        message: "User created"
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
});

app.post("/login", async (req, res) => {
    try{
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({ message: "User not found"});
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if(!passMatch) {
        return res.status(400).json({ message: "Incorrect password"});
    }

    const token = jwt.sign(
        { userID: user._id },
        process.env.JWT_TOKEN,
        { expiresIn: "7d" }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            username: user.username,
            email: user.email
        },
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});