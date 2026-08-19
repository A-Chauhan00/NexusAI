import { createContext, useEffect, useState ,useRef,useContext} from "react";
import { createChat, getChats, getChat, deleteChat, sendMessage,sendGuestMessage } from '../api/chatApi.js';
import { AuthContext } from "./AuthContext.jsx";

export const Context = createContext();

const ContextProvider = (props) => {

     const { user, authLoading } = useContext(AuthContext);            //to check if user is logged in
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingMessageId, setTypingMessageId] = useState(null);
    const sendingMessage = useRef(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [failedPrompt, setFailedPrompt] = useState(null);
    const [deleteChatId, setDeleteChatId] = useState(null);
  //for guest account
    const [guestPromptsLeft, setGuestPromptsLeft] =  useState(6);

  useEffect(() => {

      if (authLoading || !user) {
          return;
      }

      const loadChats = async () => {
          try {
              const data = await getChats();
              setChats(data.chats);
          } catch (error) {
              console.error("Failed to load chats:", error);
          }
      };

      loadChats();

  }, [user, authLoading]);
  
    useEffect(() => {

        if (!user && !authLoading) {
            setChats([]);
            setMessages([]);
            setActiveChat(null);
            setRecentPrompt("");
            setShowResult(false);
            setResultData("");
            setInput("");
        }

    }, [user, authLoading]);

    const newChat = async () => {
        try {
            setLoading(false);
            setShowResult(false);
            setResultData("");
            setRecentPrompt("");
            setMessages([]);
            setTypingMessageId(null);
              setErrorMessage("");
              setFailedPrompt(null);

            const data = await createChat("New Chat");

            setChats(prev => [data.chat, ...prev]);
            setActiveChat(data.chat._id);

        } catch (error) {
            console.error("Failed to create chat:", error);
        }
    };

    const selectChat = async (id) => {
        try {
            const data = await getChat(id);

            console.log("Selected chat:", data.chat);

            setActiveChat(id);
            setMessages(data.chat.messages);
            setTypingMessageId(null);
              setErrorMessage("");
            setShowResult(true);
            setFailedPrompt(null);

        } catch (error) {
            console.error("Failed to load chat:", error);
        }
    };

    const onSent = async (prompt) => {
        if (sendingMessage.current) return;
        sendingMessage.current = true;
         const userMessage = prompt !== undefined ? prompt : input;
        try {
            setErrorMessage("");
            setResultData("");
            setLoading(true);
            setShowResult(true);

            const userMessage = prompt !== undefined ? prompt : input;

            if (!userMessage.trim()) {
                setLoading(false);
                return;
            }
             //guest user
             if (!user) {

            const data = await sendGuestMessage(
                userMessage,
                messages
            );

            setFailedPrompt(null);
            setErrorMessage("");
            setRecentPrompt(userMessage);
            setPrevPrompts(prev => [
                ...prev,
                userMessage
            ]);

            setLoading(false);

            const assistantMessage = {
                _id: `temp-${Date.now()}`,
                role: "assistant",
                content: data.reply
            };

            setMessages(prev => [
                ...prev,
                {
                    _id: `temp-user-${Date.now()}`,
                    role: "user",
                    content: userMessage
                },
                assistantMessage
            ]); 
             
             setTypingMessageId(
                assistantMessage._id
            );

            setGuestPromptsLeft(
                data.remainingPrompts
            );

            return;
        }

        //authenticated user
            let chatId = activeChat;

            if (!chatId) {
                const chatData = await createChat("New Chat");

                chatId = chatData.chat._id;

                setActiveChat(chatId);
                setChats(prev => [chatData.chat, ...prev]);
            }

            // Send message to backend
            const data = await sendMessage(chatId, userMessage);
            setFailedPrompt(null);
            setErrorMessage("");
            setRecentPrompt(userMessage);
            setPrevPrompts(prev => [...prev, userMessage]);

            const response = data.reply;
            setLoading(false);
            if (data.chat) {
                setChats(prev => [
                    data.chat,
                    ...prev.filter(chat => chat._id !== data.chat._id)
                ]);
            }
           
           const assistantMessage = {
    _id: `temp-${Date.now()}`,
    role: "assistant",
    content: response
};

setMessages(prev => [
    ...prev,
    {
        _id: `temp-user-${Date.now()}`,
        role: "user",
        content: userMessage
    },
    assistantMessage
]);

setTypingMessageId(assistantMessage._id);


} catch (error) {
    console.error("Failed to send message:", error);

    setLoading(false);
    setFailedPrompt(userMessage);

    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 429) {
            setErrorMessage(
                message || "You've reached the prompt limit for this chat."
            );
            return;
        }

        if (status === 404) {
            setErrorMessage(message || "Chat not found.");
            return;
        }

        setErrorMessage(message || "Something went wrong.");
        return;
    }

    setErrorMessage("Unable to connect to the server.");

}
    finally {
    sendingMessage.current = false;
    }
    };


const handleDeleteChat = async (id) => {
    try {
        await deleteChat(id);

        setChats(prev =>
            prev.filter(
                chat => String(chat._id) !== String(id)
            )
        );

        if (String(activeChat) === String(id)) {
            setActiveChat(null);
            setMessages([]);
            setShowResult(false);
        }

    } catch (error) {
        console.error(
            "Failed to delete chat:",
            error.response?.data || error
        );
    }
};  
    
    const openDeleteModal = (id) => {
    setDeleteChatId(id);
};

    const retryMessage = async () => {
    if (!failedPrompt || !activeChat) return;

    setErrorMessage("");

    await onSent(failedPrompt);

    setFailedPrompt(null);
};
    
const renameChat = async (chatId, newTitle) => {
    try {
        if (!newTitle.trim()) {
            return;
        }

        const response = await axios.put(
            `${API_URL}/api/chats/${chatId}`,
            {
                title: newTitle.trim()
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        if (response.data.success) {
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? { ...chat, title: response.data.chat.title }
                        : chat
                )
            );
        }

    } catch (error) {
        console.error("Rename chat error:", error);
    }
};
    const contextValue = {
        prevPrompts,
        setPrevPrompts,

        onSent,

        setRecentPrompt,
        recentPrompt,

        showResult,
        loading,
        resultData,

        input,
        setInput,

        newChat,
        selectChat,

        chats,
        setChats,

        activeChat,
        setActiveChat,

        handleDeleteChat,
        deleteChatId,
        setDeleteChatId,
        openDeleteModal,

        messages,
        setMessages,

        typingMessageId,
        setTypingMessageId,

        errorMessage,
        setErrorMessage,

        retryMessage,

        failedPrompt,
        setFailedPrompt,

          renameChat,

          //for guest account
           guestPromptsLeft
    };
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;