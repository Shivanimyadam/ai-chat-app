import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import '../styles/Sidebar.css'

function Sidebar({ user, currentSession, onSelectSession, onNewChat , refreshSidebar}) {

    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        loadSessions();
    }, [refreshSidebar]);

    const loadSessions = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/sessions',
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            console.log("load sessions result", res, res.data);
            setSessions(res.data);
        } catch (error) {
            console.error('Failed to load sessions:', error);

        }
    };

    const handleNewChat = async () => {
        try {
            const res = await axios.post('http://localhost:5001/api/sessions/',
                { title: 'New Chat' },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            setSessions(prev => [res.data, ...prev]);
            onNewChat(res.data);
        } catch (error) {
            console.error('Failed to create session: ', error);
        }

    };

     const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    console.log( `http://localhost:5001/api/sessions/${sessionId}`);
    try {
      await axios.delete(`http://localhost:5001/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) onNewChat(null);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };



    return (
        <>
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1>AI Chat</h1>
                    <button className="new-chat-btn" onClick={handleNewChat}> + New Chat</button>
                </div>
                <div className="sidebar-sessions">
                    {sessions.length === 0 && (
                        <p className="no-sessions">No chats yet!</p>
                    )}
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`session-item ${currentSession?.id === session.id ? 'active' : ''}`}
                            onClick={() => onSelectSession(session)}
                        >
                            <span className="session-title">💬 {session.title}</span>
                            <button
                                className="delete-btn"
                                onClick={(e) => handleDelete(e, session.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
                <div className="sidebar-footer">
                    <span>👤 {user.username}</span>
                </div>
            </div>
        </>
    );
}

export default Sidebar;