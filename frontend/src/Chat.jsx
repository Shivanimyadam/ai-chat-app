import { useState } from "react";
import axios from 'axios';
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import { useRef } from "react";
import { useEffect } from "react";
import './styles/Chat.css';


function Chat ({theme, toggleTheme}) {

    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({behavior:'smooth'});
    },[messages]);

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
        {/* <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg,index)=>(
                    <ChatMessage key={index} message={msg}/>
                ))}
                {loading && <div className="loading">AI is thinking...</div>}
            </div>
            <ChatInput onSend={handleSend} loading={loading} />
        </div> */}
        <div className="chat-wrapper">
            <div className="chat-header">
                <h1>AI Chat</h1>
                <button className="toggle-theme" onClick={toggleTheme}>
                    {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                     <div className="empty-state">
            <h2>How can I help you today?</h2>
          </div>
                )}
                {messages.map((msg,index)=>(
                    <ChatMessage key={index} message={msg}/>
                ))}
                {loading && (
                <div className="loading-dots">
                                <span></span><span></span><span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={handleSend} loading={loading} />
        </div>
        </>
    );
} 

export default Chat;