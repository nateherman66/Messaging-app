const mongoose = require("Mongoose");
const Conversation = require("./Conversation");
const { applyTimestamps } = require("./User");

const messageSchema = new mongoose.Schema(
    {
        Conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        test: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", messageSchema);