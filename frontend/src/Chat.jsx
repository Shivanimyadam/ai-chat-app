import { useState } from "react";
import axios from 'axios';
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import { useRef } from "react";
import { useEffect } from "react";
import './styles/Chat.css';


function Chat ({theme, toggleTheme, user, onLogout}) {

    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const messagesEndRef = useRef(null);

     // load messages on start
    useEffect(()=>{
        const loadMessages = async ()=>{
            try {
                const res = await axios.get('http://localhost:5001/api/chat',{
                    headers :{
                        Authorization : `Bearer ${user.token}`
                    }
                });
                setMessages(res.data.map(msg=>({
                    role : msg.role,
                    text: msg.text
                })));
            } catch (error) {
                        console.error('Failed to load messages:', error);
            }
        };
        loadMessages()
    },[]);

    //AutoScroll
    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({behavior:'smooth'});
    },[messages]);

    const handleSend = async(text) => {

        const userMessage = { role:'user', text};
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

console.log("user types message -->",userMessage);

        try {
            const res = await axios.post('http://localhost:5001/api/chat',
                { message : text},
                {   headers :{
                        Authorization : `Bearer ${user.token}`
                    }
            }
        );
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
                <div className="header-right">
                        <span className="username">👤 {user.username}</span>
<button className="toggle-theme" onClick={toggleTheme}>
                    {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
                 <button className="logout-btn" onClick={onLogout}>
      Logout
    </button>
                </div>
                
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                     <div className="empty-state">
            <h2>How can I help you today?</h2>
          </div>
                )}
                {messages.map((msg,index)=>(
                    <ChatMessage key={index} message={msg} theme={theme} />
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