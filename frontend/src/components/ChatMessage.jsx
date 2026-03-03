import ReactMarkdown from 'react-markdown'

function ChatMessage({ message }){
    console.log("message in chat msg component-->",message);
    return (
        <>
            <div className={`message ${message.role}`}>
                <div className="bubble">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
            </div>
        </>
    );
}

export default ChatMessage;