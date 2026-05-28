const express = require("express");
const cors = require("cors");

const app = express();

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
    console.log(username, email, password);

    res.json({
        message: "User created"
    });
})