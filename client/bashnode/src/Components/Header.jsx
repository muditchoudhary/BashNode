import PropTypes from "prop-types";
import bashNodeLogo from "../assets/react.svg";

const CompanyName = (props) => {
	return <p className="text-3xl font-bold underline">{props.name}</p>;
};
CompanyName.propTypes = {
	name: PropTypes.string,
};

const CompanyLogo = (props) => {
	return <img src={props.logo} alt={props.altLogoText} />;
};
CompanyLogo.propTypes = {
	logo: PropTypes.string,
	altLogoText: PropTypes.string,
};

const Header = () => {
	return (
		<>
			<div>
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
