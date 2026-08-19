const generateChatTitle = (message) => {
    let title = message
        .trim()
        .replace(/\s+/g, " ");

    title = title.replace(
        /^(can you|could you|please|tell me|i want to know|would you)\s+/i,
        ""
    );

    if (title.length > 40) {
        title = title.slice(0, 40).trim() + "...";
    }

    return title.charAt(0).toUpperCase() + title.slice(1);
};

export default generateChatTitle;