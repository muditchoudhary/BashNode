import PropTypes from "prop-types";
import bashNodeLogo from "../assets/images/hashnode-icon.svg";
import { useMediaQuery } from "react-responsive";

const CompanyName = (props) => {
	return (
		<p className=" text-electric-blue font-bold text-2xl desktop:text-5xl lg:text-center lg:text-3xl">
			{props.name}
		</p>
	);
};
CompanyName.propTypes = {
	name: PropTypes.string,
};

const CompanyLogo = (props) => {
	return (
		<img src={props.logo} alt={props.altLogoText} className=" w-7 h-7 " />
	);
};
CompanyLogo.propTypes = {
	logo: PropTypes.string,
	altLogoText: PropTypes.string,
};

const Header = () => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	if (isDesktop) {
		return (
			<>
				<CompanyName name="BashNode" />
			</>
		);
	}
	return (
		<>
			<div
				className="header flex items-center gap-2 py-2 px-1 border-b-2 border-gray-700 "
				data-testid="header"
			>
				<CompanyLogo
					logo={bashNodeLogo}
					altLogoText={"BashNode's Logo"}
				/>
				<CompanyName name={"BashNode"} />
			</div>
		</>
	);
};

export default Header;
