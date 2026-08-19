import  generateChatResponse  from "../services/geminiService.js";

const guestUsage = new Map();

const MAX_GUEST_PROMPTS = 6;

const sendGuestMessage = async (req, res) => {
    try {
        const { message, guestId, messages = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        if (!guestId) {
            return res.status(400).json({
                success: false,
                message: "Guest ID is required"
            });
        }

        const promptCount = guestUsage.get(guestId) || 0;

        if (promptCount >= MAX_GUEST_PROMPTS) {
            return res.status(429).json({
                success: false,
                message: "You've used all free prompts. Register to continue."
            });
        }

        const userMessage = {
            role: "user",
            content: message.trim()
        };

        const conversation = [
            ...messages,
            userMessage
        ];

        const reply = await generateChatResponse(conversation);

        guestUsage.set(guestId, promptCount + 1);

        const remainingPrompts =
            MAX_GUEST_PROMPTS - (promptCount + 1);

        return res.status(200).json({
            success: true,
            reply,
            remainingPrompts
        });

    } catch (error) {
        console.error("Guest message error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate response"
        });
    }
};

export {
    sendGuestMessage
};