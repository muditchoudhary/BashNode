import { CompanyName, CompanyLogo } from "./Header";
import bashNodeIcon from "../assets/images/hashnode-icon.svg";
import Icon from "./Icon";
import writingIcon from "../assets/icons/writing.svg";
import notificationIcon from "../assets/icons/notification.svg";

const Navbar = () => {
	return (
		<>
			<div className=" border-b-2 border-serene-sky p-2 flex justify-between">
				<div>
					<CompanyLogo
						logo={bashNodeIcon}
						altLogoText={"BashNode's Icon"}
					/>
				</div>
				<div className=" flex gap-2">
					<Icon icon={writingIcon} altIconText={"A writing icon"} />
					<Icon
						icon={notificationIcon}
						altIconText={"Notification bell icon"}
					/>
				</div>
			</div>
		</>
	);
};

export default Navbar;
