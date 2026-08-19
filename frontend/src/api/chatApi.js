import api from "./axios";

export const createChat=async(title)=>{
    const response=await api.post("/chats",{
        title
    })

    return response.data;
}

export const getChats=async()=>{
    const response=await api.get("/chats")
    return response.data;
}

export const getChat=async(id)=>{
    const response=await api.get(`/chats/${id}`)
    return response.data;
}

export const deleteChat=async(id)=>{
    const response=await api.delete(`/chats/${id}`)
    return response.data;
}

export const sendMessage=async(id,message)=>{
 const response=await api.post(`/chats/${id}/messages`,{message})
 return response.data;
}

//for guest accounts

export const sendGuestMessage = async (
    message,
    messages
) => {

    const guestId = getGuestId();

    const response = await api.post(
        "/guest/message",
        {
            guestId,
            message,
            messages
        }
    );

    return response.data;
};

const getGuestId = () => {
    let guestId = localStorage.getItem("nexusai_guest_id");

    if (!guestId) {
        guestId = crypto.randomUUID();

        localStorage.setItem(
            "nexusai_guest_id",
            guestId
        );
    }

    return guestId;
};