import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const Lines = () => {
	return (
		<div className="flex items-center">
			<span className="border-[1px] border-black w-24 "></span>
		</div>
	);
};
const OrDivider = () => {
	return (
		<>
			<div className="flex justify-center gap-2">
				<Lines />
				<span>OR</span>
				<Lines />
			</div>
		</>
	);
};
const Footer = (props) => {
	return (
		<>
			<div className="flex flex-col items-center mt-4 gap-3 desktop:text-2xl desktop:mt-11">
				<OrDivider />
				<Link to={props.linkTo}>{props.footerText}</Link>
			</div>
		</>
	);
};
Footer.propTypes = {
	footerText: PropTypes.string,
	linkTo: PropTypes.string,
};

export default Footer;
