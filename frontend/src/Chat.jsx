import { useState } from "react";
import axios from 'axios';
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";



function Chat () {

    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);

    const handleSend = async(text) => {

        const userMessage = { role:'user', text};
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

console.log("user types message -->",userMessage);

        try {
            const res = await axios.post('http://localhost:5001/api/chat',{
                message : text
            });
            console.log("res ---> axios",res);
            const aiMessage = { role: 'ai', text: res.data.reply };
            console.log("AI message --->",aiMessage);
            setMessages(prev => [...prev, aiMessage]);
        } catch(error){
            console.error("catched error -->",error);
        } finally{
            setLoading(false);
        }
    };

    return (
        <>
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg,index)=>(
                    <ChatMessage key={index} message={msg}/>
                ))}
                {loading && <div className="loading">AI is thinking...</div>}
            </div>
            <ChatInput onSend={handleSend} loading={loading} />
        </div>
        </>
    );
} 

export default Chat;