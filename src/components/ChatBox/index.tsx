import { useState } from "react";
import "./styles.scss";
import { MessageType } from "../../custom_types";



interface ChatBoxProps {
    messages: MessageType[],
}

const ChatBox: React.FC<ChatBoxProps> = () => {
    const [message, setMessage] = useState<string>();

    return (
        <div className="chat-box">
            <div className="messages-wrapper">
                <div className="message">Hello</div>
                <div className="message">Hello too</div>
                <div className="message received">Hello too</div>
            </div>
            
            <div className="input-field">
                <textarea placeholder="Enter message" value={message} onChange={e => setMessage(e.target.value)}></textarea>

                <div className="send-btn" onClick={() => console.log(message)}>
                    <i className="bx bx-send"></i>
                </div>
            </div>
        </div>
    )
}

export default ChatBox;