const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

const users = [];

app.use(cors());
app.use(express.json());

// respond with server running when a GET request is sent
app.get("/", (req, res) => {
    res.send("server running");
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
})

app.post("/signup", async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        email,
        password: hashedPassword,
});

    console.log("Signup recieved:")
    console.log(username, email, password);

    res.json({
        message: "User created"
    });
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const user = users.find((user) => user.email == email);

    if (!user) {
        return res.status(400).json({ message: "User not found"});
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if(!passMatch) {
        return res.status(400).json({ message: "Incorrect password"});
    }

    res.json({
        message: "Login successful",
        user: {
            username: user.username,
            email: user.email
        },
    });
});