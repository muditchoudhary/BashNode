import PropTypes from "prop-types";

const Icon = (props) => {
	return (
		<img src={props.icon} alt={props.altIconText} className=" w-7 h-7 " />
	);
};
Icon.propTypes = {
	icon: PropTypes.string,
	altIconText: PropTypes.string,
};

export default Icon;
