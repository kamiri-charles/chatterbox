import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";

const Chat: React.FC = () => {
    return (
        <div className="chat">
            <Navbar />
            <ChatBox />
        </div>
    )
}

export default Chat;