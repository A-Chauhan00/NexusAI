import React, { useContext,useState,useEffect, useRef} from 'react';
import './Main.css';
import { Context } from '../../context/Context.jsx';
import { BiSend } from "react-icons/bi";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import MarkdownTyper from "react-markdown-typer";
import { AuthContext } from "../../context/AuthContext.jsx";
import { MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Main = ({ setExtended }) => {
    const {
        onSent,
        showResult,
        loading,
        input,
        setInput,
        messages,
        deleteChatId,
        setDeleteChatId,
        handleDeleteChat,
        typingMessageId,
        setTypingMessageId,
        errorMessage,
        retryMessage,
        guestPromptsLeft
    } = useContext(Context);

    const { user, logout } = useContext(AuthContext);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const userMenuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();
    
    return (
        <div className="main">
            <div className="main-container">
                <div className="nav">
                    <MdMenu
                        className="mobile-menu"
                        onClick={() => {
                            setExtended(true);
                        }}
                    />
                    <p  className='logo '>NEXUSAI</p>

                    {user?(
                 
                        <div className="user-menu-container"
                           ref={userMenuRef}>

                            <FaUserCircle
                                className="user-icon"
                                onClick={() => setUserMenuOpen(prev => !prev)}
                            />

                            {userMenuOpen && (
                                <div className="user-menu">

                                    <p className="user-name">
                                        {user?.name}
                                    </p>
                                    <p className="user-email">
                                        {user?.email}
                                    </p>
                                    <div className="button-div">
                                        <button className='logout-button'
                                            onClick={async () => {
                                                await logout();
                                                navigate("/login", { replace: true });
                                            }}
                                        >
                                            <MdLogout className='logout-icon' /> Logout
                                        </button>
                                    </div>


                                </div>
                            )}

                        </div>
                    ):
                    (   
                        //  for guest account
                          <div className="user-info">
                        <button
                           className='register-button'
                            onClick={() => {
                                navigate("/register");
                            }}
                        >
                            Register
                        </button>
                    </div>

                    )}
                </div>

                {!showResult ? (

                    <>

                        <div className="greet">
                            <p>Hello, User.</p>
                            <p>  What can I help you with?</p>
                        </div>


                    </>

                ) : (

                    <div className="result">

                        {messages.map((message, index) => {

                            if (message.role === "user") {

                                return (
                                    <div
                                        className="result-title"
                                        key={index}
                                    >
                                        <p>
                                            {message.content}
                                        </p>
                                    </div>
                                );

                            }

                            return (
                                <div
                                    className="result-data"
                                    key={index}
                                >
                                    {/* response formatting */}

                                    {message._id === typingMessageId ? (                                   //temporary id for typing effect
                                        <MarkdownTyper interval={1} reactMarkdownProps={{
                                            components: {
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || "");

                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={oneDark}
                                                            language={match[1]}
                                                            PreTag="div"
                                                        >
                                                            {String(children).replace(/\n$/, "")}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code
                                                            className={className}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }
                                        }}
                                            onComplete={() => setTypingMessageId(null)}
                                        >
                                            {message.content}
                                        </MarkdownTyper>
                                    ) : (
                                        <ReactMarkdown
                                            components={
                                                {
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || "");

                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                style={oneDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                            >
                                                                {String(children).replace(/\n$/, "")}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code
                                                                className={className}
                                                                {...props}
                                                            >
                                                                {children}
                                                            </code>
                                                        );
                                                    }
                                                }
                                            }
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    )}

                                </div>
                            );

                        })}

                        {/* error messages */}
                        {errorMessage && (
                            <div className="chat-error">
                                <p><FaTriangleExclamation /> {errorMessage}</p>
                                <button onClick={retryMessage} className='retryButton'>
                                    Retry
                                </button>
                            </div>
                        )}

                    </div>


                )}


                <div className="main-bottom">
                    {/* for guest account */}
                    {!user && guestPromptsLeft === 0 ? (
                        <div className="guest-limit">

                            <p>
                                You've used all 6 free prompts.
                            </p>

                            <span>
                                Create an account to continue chatting with NexusAI.
                            </span>

                            <div className="guest-limit-buttons">

                                <button onClick={() => navigate("/register")}>
                                    Register
                                </button>

                                <button onClick={() => navigate("/login")}>
                                    Login
                                </button>

                            </div>

                        </div>
                    ) : (
                            
                        <div className={`search-box ${loading ? "loading-effect" : ""}`}>

                            <input
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onSent();
                                        setInput("");
                                    }
                                }}
                                value={input}
                                type="text"
                                placeholder="Enter a prompt here"
                            />

                            <div>

                                <button onClick={() => { onSent(); setInput("") }} disabled={loading}>
                                    <BiSend className="sendIcon" />
                                </button>

                            </div>
                        </div>

                    )}
                    {/* for guest accounts */}
                    {!user && guestPromptsLeft > 0 && (
                        <p className="guest-prompts">
                            {guestPromptsLeft} free prompt
                            {guestPromptsLeft !== 1 ? "s" : ""} remaining
                        </p>
                    )}
                </div>

            </div>
            {/* delete confirmation */}
            {deleteChatId && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Delete chat?</h3>
                        <p>
                            Are you sure you want to delete this chat?
                            This action cannot be undone.
                        </p>

                        <div className="delete-modal-buttons">
                            <button onClick={() => setDeleteChatId(null)} className='cancel-button'>
                                Cancel
                            </button>

                            <button onClick={() => {
                                handleDeleteChat(deleteChatId);
                                setDeleteChatId(null);
                            }} className='delete-button'>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Main;