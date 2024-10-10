import { useState } from "react";
import "./styles.scss";

interface ChatBoxProps {
    unique_id: string,
}

const ChatBox: React.FC<ChatBoxProps> = ({unique_id}) => {
    const [message, setMessage] = useState<string>()
    return (
        <div className="chat-box">
            <div className="u-id">{unique_id ? unique_id : null}</div>

            <div className="messages-wrapper"></div>
            
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