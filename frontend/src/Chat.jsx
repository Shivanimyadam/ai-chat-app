import { useState } from "react";
import axios from 'axios';
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import { useRef } from "react";
import { useEffect } from "react";
import './styles/Chat.css';
import Sidebar from "./components/Sidebar";


function Chat({ theme, toggleTheme, user, onLogout }) {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [currentSession, setCurrentSession] = useState(null);

    const [refreshSidebar, setRefreshSidebar] = useState(0);

    //AutoScroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadMessages = async (sessionId) => {
        try {
            const res = await axios.get(`http://localhost:5001/api/chat?session_id=${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setMessages(res.data.map(msg => ({
                role: msg.role,
                text: msg.text
            })));
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    // session related
    useEffect(() => {
        if (currentSession) loadMessages(currentSession.id);
        else setMessages([]);
    }, [currentSession]);


    const handleSend = async (text) => {

        if (!currentSession) return;

        const userMessage = { role: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        console.log("user types message -->", userMessage);

        try {
            const res = await axios.post('http://localhost:5001/api/chat',
                { message: text, session_id: currentSession.id },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            console.log("res ---> axios", res);
            const aiMessage = { role: 'ai', text: res.data.reply };
            console.log("AI message --->", aiMessage);
            setMessages(prev => [...prev, aiMessage]);
            // In handleSend after getting reply:
            if (currentSession.title === 'New Chat') {
                setCurrentSession(prev => ({ ...prev, title: text.slice(0, 30) }));
                setRefreshSidebar(prev => prev + 1); // triggers sidebar reload
            }
        } catch (error) {
            console.error("catched error -->", error);
        } finally {
            setLoading(false);
        }
    };


    const handleClearChat = async () => {
        if (!currentSession) return;
        if (!window.confirm('Clear all messages in this chat?')) return;

        try {
            await axios.delete(
                `http://localhost:5001/api/sessions/${currentSession.id}/messages`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMessages([]);
        } catch (error) {
            console.error('Failed to clear chat:', error);
        }
    };

    return (
        <>
            <div className="chat-layout">
                <Sidebar
                    user={user}
                    currentSession={currentSession}
                    onSelectSession={setCurrentSession}
                    onNewChat={setCurrentSession}
                    refreshSidebar={refreshSidebar}
                />

                <div className="chat-wrapper">
                    <div className="chat-header">
                        <h1>{currentSession ? currentSession.title : 'AI Chat'}</h1>
                        <div className="header-right">
                            {currentSession && (
                                <button className="clear-btn" onClick={handleClearChat}>
                                    🗑️ Clear
                                </button>
                            )}
                            <button className="toggle-theme" onClick={toggleTheme}>
                                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                            </button>
                            <button className="logout-btn" onClick={onLogout}>
                                Logout
                            </button>
                        </div>

                    </div>
                    <div className="chat-messages">
                        {!currentSession && (
                            <div className="empty-state">
                                <h2>Select or create a new chat! 👈</h2>
                            </div>
                        )}
                        {currentSession && messages.length === 0 && (
                            <div className="empty-state">
                                <h2>How can I help you today?</h2>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} theme={theme} />
                        ))}
                        {loading && (
                            <div className="loading-dots">
                                <span></span><span></span><span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <ChatInput onSend={handleSend} loading={loading || !currentSession} />
                </div>
            </div>
        </>
    );
}

export default Chat;