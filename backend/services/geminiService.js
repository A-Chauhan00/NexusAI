
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY
});

const generateChatResponse = async (messages) => {
    try {
        const history = messages.slice(0, -1).map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [
                {
                    text: message.content
                }
            ]
        }));

        const latestMessage = messages[messages.length - 1];

        const chat = ai.chats.create({
            model: "gemini-3.6-flash",
            history
        });

        const response = await chat.sendMessage({
            message: latestMessage.content
        });

        return response.text;

    } catch (error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
};

export default generateChatResponse;


