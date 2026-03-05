import { useState } from "react";
import '../styles/ChatInput.css';

function ChatInput({ onSend, loading }) {

    const [input, setInput] = useState('');
    console.log("input component", input);
    const handleSend = () => {
        if (!input.trim()) return;
        console.log("input component- HANDLE SEND", input, input.trim());
        onSend(input);
        setInput('');
        console.log("input component after send", input);
    };
    return (
        <>
            <div className="input-wrapper">
                <div className="input-container">
                    <textarea
                        placeholder="Message AI..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={loading}
                        rows={1}
                    />
                    <button onClick={handleSend} disabled={loading}>
                        {loading ? '⏳' : '➤'}
                    </button>
                </div>
                <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>

            </div>

        </>
    );
}

export default ChatInput;