import { FC} from "react";
import "./styles.scss";

interface ToolTipIconProps {
	iconName: string;
    tooltipMessage?: string;
	solid?: boolean;
	size?: number;
    forcedHoverState?: boolean;
}

const TooltipIcon: FC<ToolTipIconProps> = ({ iconName, tooltipMessage, solid=false, size=24, forcedHoverState }) => {



	const get_icon_class = () => {
        if (solid) return `bxs bx-${iconName}`;
        return `bx bx-${iconName}`;
    };

	return (
		<div className={`tooltip-icon${forcedHoverState ? " forced-hover-state": ""}`} style={{width: `${size + 10}px`, height: `${size + 10}px`, fontSize: `${size}px`}}>
			<i className={get_icon_class()}></i>
            {tooltipMessage ? <span className="tooltip-message">{tooltipMessage}</span> : null}
		</div>
	);
};

export default TooltipIcon;
