import ReactMarkdown from 'react-markdown';
import '../styles/ChatMessage.css';

function ChatMessage({ message }) {
    console.log("message in chat msg component-->", message);
    return (
        <>
            <div className={`message-row ${message.role}`}>
                <div className="message-avatar">
                    {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                    <span className="message-role">
                        {message.role === 'user' ? 'You' : 'AI'}
                    </span>
                    <div className="message-text">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatMessage;