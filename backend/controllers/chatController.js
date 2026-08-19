
import Chat from "../models/chat.js";
import generateChatResponse from "../services/geminiService.js";
import generateChatTitle from "../utils/generateChatTitle.js";

const createChat=async(req,res)=>{
   try {
    const {title}=req.body;
    const chat=await Chat.create({title, user: req.user.userId});
     return res.status(201).json({
        success:true,
        message:"Chat created successfully",
        chat
    })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getChats=async(req,res)=>{
      try {
        const chats= await Chat.find( { user: req.user.userId },"-messages").sort({updatedAt:-1});
        return res.status(200).json({
            success:true,
            message:"Chats fetched successfully",
            count:chats.length,
            chats
        })
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getChat = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findOne({
            _id: id,
            user: req.user.userId
        });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" })
        }


        return res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            chat
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



 const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete chat"
        });
    }
};

const sendMessage=async(req,res)=>{

    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }
        const chat = await Chat.findOne({
            _id: id,
            user: req.user.userId
        });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        } 

          //limiting prompt
        const promptCount =chat.messages.filter(
            message=>message.role==="user"
        ).length;
        const MAX_PROMPTS=20;
        if (promptCount >= MAX_PROMPTS) {
            return res.status(429).json({
                success: false,
                message: "Prompt limit reached for this chat."
            });
        }
       
         const isFirstMessage = promptCount === 0;

        //pushing user prompt into db
        chat.messages.push({
            role: "user",
            content: message
        })
        
        ///generating reply from gemini
        const reply = await generateChatResponse(chat.messages);
        chat.messages.push({
            role: "assistant",
            content: reply
        });
        
        if (isFirstMessage) {
            chat.title = generateChatTitle(message);
        }

        await chat.save();
        return res.status(200).json({
            success: true,
            message:"response generated successfully",
            reply,
            chat
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const renameChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Chat title is required"
            });
        }

        const chat = await Chat.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.title = title.trim();

        await chat.save();

        res.status(200).json({
            success: true,
            message: "Chat renamed successfully",
            chat
        });

    } catch (error) {
        console.error("Rename chat error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to rename chat"
        });
    }
};

export {createChat,getChat,getChats,deleteChat,sendMessage,renameChat}