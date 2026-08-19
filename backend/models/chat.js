import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
)

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            default: "New chat",
            required: true
        },
        model: {
            type: String,
            default: "gemini-2.5-flash"
        },
        lastMessageAt: {
            type: Date,
            default: Date.now
        },
        messages: [messageSchema]
    }, {
    timestamps: true
}
)


export default mongoose.model("Chat", chatSchema);