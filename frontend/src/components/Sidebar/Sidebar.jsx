import React, { useState, useContext, useEffect } from 'react';
import './Sidebar.css';
import { Context } from "../../context/Context.jsx";
import { MdMenu } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ extended, setExtended, user }) => {

    const {
        newChat,
        chats,
        activeChat,
        selectChat,
        handleDeleteChat,
        openDeleteModal,
        renameChat
    } = useContext(Context);

    const [editingChatId, setEditingChatId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [openChatMenuId, setOpenChatMenuId] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".chat-options")) {
                setOpenChatMenuId(null);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const handleRename = async (chatId) => {
        const trimmedTitle = editingTitle.trim();

        if (!trimmedTitle) {
            return;
        }

        try {
            await renameChat(chatId, trimmedTitle);

            setEditingChatId(null);
            setEditingTitle("");



        } catch (error) {
            console.error("Rename failed:", error);
        }
    };
    return (
        <>
            {extended && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setExtended(false)}
                />
            )}
            <div className={`sidebar ${extended ? "sidebar-open" : ""}`}>
                <div className="top">

                    <MdMenu
                        onClick={() => setExtended(prev => !prev)}
                        className="menu"
                    />

                    <br />

                    <div className="new-chat">
                        {extended ?
                            <button
                                className='new-chat-button'
                                onClick={() => newChat()}
                            >
                                <FaPlus /> New chat
                            </button>
                            : null
                        }
                    </div>


                    {extended && (
                        <div className="recent">

                            <p className="recent-title">
                                Recent
                            </p>

                            {user ? (
                                chats.map((chat) => {
                                    return (
                                        <div
                                            key={chat._id}
                                            className={`recent-entry ${activeChat === chat._id ? "active-chat" : ""}`}
                                            onClick={() => selectChat(chat._id)}
                                        >

                                            {editingChatId === chat._id ? (

                                                <div className="rename-container">

                                                    <input
                                                        type="text"
                                                        value={editingTitle}
                                                        onChange={(e) => setEditingTitle(e.target.value)}
                                                        onKeyDown={(e) => {

                                                            if (e.key === "Enter") {
                                                                handleRename(chat._id);
                                                            }

                                                            if (e.key === "Escape") {
                                                                setEditingChatId(null);
                                                                setEditingTitle("");
                                                            }

                                                        }}
                                                        autoFocus
                                                    />

                                                    <button
                                                        className="rename-save"
                                                        onClick={() => handleRename(chat._id)}
                                                    >
                                                        <FaCheck/>
                                                    </button>

                                                    <button
                                                        className="rename-cancel"
                                                        onClick={() => {
                                                            setEditingChatId(null);
                                                            setEditingTitle("");
                                                        }}
                                                    >
                                                        < MdOutlineCancel/>
                                                    </button>

                                                </div>

                                            ) : (

                                                <p>
                                                    {chat.title.slice(0, 18)}
                                                    {chat.title.length > 18 ? "..." : ""}
                                                </p>

                                            )}
                                            {editingChatId !== chat._id && (<div className="chat-options">
                                                <BsThreeDotsVertical
                                                    className="options-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setOpenChatMenuId(prev =>
                                                            prev === chat._id ? null : chat._id
                                                        );
                                                    }}
                                                />

                                                {openChatMenuId === chat._id && (

                                                    <div className="options-menu">

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                setEditingChatId(chat._id);
                                                                setEditingTitle(chat.title);
                                                                setOpenChatMenuId(null);
                                                            }}
                                                        >
                                                            <MdEdit />
                                                            Rename
                                                        </button>

                                                        <button
                                                            className="delete-option"
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                openDeleteModal(chat._id);
                                                                setOpenChatMenuId(null);
                                                            }}
                                                        >
                                                            <RiDeleteBin5Fill />
                                                            Delete
                                                        </button>

                                                    </div>

                                                )}

                                            </div>)}
                                        </div>

                                    );

                                })
                            ) : (
                                <div className="guest-sidebar-message">

                                    <p>
                                        Sign in to save
                                        <br />
                                        your conversations
                                    </p>

                                    <button onClick={() => navigate("/register")}>
                                        Register
                                    </button>
                                     <button onClick={() => navigate("/login")}>
                                        Login
                                    </button>

                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;