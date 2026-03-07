import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/ChatMessage.css';

function ChatMessage({ message,theme }) {
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
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={theme === 'dark' ? oneDark : oneLight}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className="inline-code" {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >{message.text}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatMessage;