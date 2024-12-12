import { Dispatch, FC, SetStateAction } from "react";
import "./styles.scss";

interface ServersListProps {
    setServersDisplay: Dispatch<SetStateAction<boolean>>;
}

const ServersList: FC<ServersListProps> = ({setServersDisplay}) => {
  return (
    <div className="servers-list">
        <div className="s-list-header">
            <div className="back" onClick={() => setServersDisplay(false)}><i className="bx bx-left-arrow-alt"></i></div>
            <i className="bx bx-message-square"></i>
            <span>Servers</span>
        </div>

        <div className="s-list">
            <div className="server">Test Server</div>
            <div className="server">Test Server</div>
            <div className="server">Test Server</div>
            <div className="server">Test Server</div>
        </div>
    </div>
  )
}

export default ServersList