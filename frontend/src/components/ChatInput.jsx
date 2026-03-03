import { useState } from "react";

function ChatInput({ onSend, loading}){

    const [input, setInput] = useState('');
console.log("input component", input);
    const handleSend = () => {
        if(!input.trim()) return;
        console.log("input component- HANDLE SEND", input,input.trim());
        onSend(input);
        setInput('');
        console.log("input component after send", input);
    };
    return (
        <>
        <div className="chat-input">
            <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            />
             <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
        </div>
        </>
    );
}

export default ChatInput;