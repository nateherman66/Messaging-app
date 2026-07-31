const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const User = require("./models/User");
const auth = require("./middleware/auth");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
app.use(cors());
app.use(express.json());

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
        { expiresIn: "1d" }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        },
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
});

app.post("/conversations", auth, async (req, res) => {
    try {
        const { name, members = []} = req.body;
        const LoggedInUserID = req.user.userID.toString();
        const otherUserID = members[0]?.toString();

        if (!otherUserID) {
            return res.status(400).json({
                message: "Another user is required",
            });
        }

        if (otherUserID === LoggedInUserID) {
            return res.status(400).json({
                message: "You cannot create a conversation with yourself",
            });
        }

        const conversationMembers = [
            ...new Set([
                LoggedInUserID.toString(),
                ...members.map((member) => member.toString()),
            ]),
        ];

        if (conversationMembers.length !== 2) {
            return res.status(400).json({
                message: "A one-on-one must have two users",
            });
        }

         const existingConversation = await Conversation.findOne({
                members: {
                        $all: [LoggedInUserID, otherUserID],
                },
        });

         if (existingConversation) {
            console.log("Exisiting conversation found:",
                existingConversation._id
            );
        return res.status(200).json(existingConversation);
    }

        const conversation = await Conversation.create({
            name,
            members: [LoggedInUserID, otherUserID],
        });

        console.log("New conversation created:",
            conversation._id
        );

        res.status(201).json(conversation);
    } catch (error) {
        console.error("Create conversation error:", error);

        res.status(500).json({
            message: "Could not create conversation",
            error: error.message,
        });
    }
});

app.get("/conversations", auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: req.user.userID,
        }).populate("members", "username");

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Get conversation error:", error);

        res.status(500).json({
            message: "Could not load conversations",
            error: error.message,
        });
    }
    });

app.post("/messages", auth, async (req, res) => {
    try {
        const { conversation, text } = req.body;

        if (!conversation) {
            return res.status(400).json({
                message: "Conversation is required",
            });
        }

        if (!text?.trim()) {
            return res.status(400).json({
                message: "Message text is required",
            });
        }

        const existingConversation = await Conversation.findOne({
            _id: conversation,
            members: req.user.userID,
        });

        if (!existingConversation) {
            return res.status(403).json({
                message: "You do not have access to this conversation",
            });
        }

        const message = await Message.create({
            conversation,
            sender: req.user.userID,
            text: text.trim(),
        });

        await message.populate("sender", "username");

        res.status(201).json(message);
    } catch (error) {
        console.error("Create message error:", error);

        res.status(500).json({
            message: "Could not create message",
            error: error.message,
        });
    }
});

app.get("/messages/:conversationId", auth, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.conversationId,
            members: req.user.userID,
        });

        if (!conversation) {
            return res.status(403).json({
                message: "You do not have access to this conversation",
            });
        }

        const messages = await Message.find({
            conversation: req.params.conversationId,
        })
        .populate("sender", "username")
        .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Get messages error:", error);

        res.status(500).json({
            message: "Could not retrieve messages",
            error: error.message,
        });
    }
});

app.get("/users/search", auth, async (req, res) => {
    try {
        const username = req.query.username?.trim();

        if (!username) {
            return res.status(400).json({
                message: "Username is required",
            });
        }

        const user = await User.findOne({
            username: { $regex: `^${username}$`,
            $options: "i" 
        },
        _id: {
            $ne: req.user.userID
        },
        }).select("_id username email");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Search user error:", error);

        res.status(500).json({
            message: "Could not search for user",
            error: error.message,
        });
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});