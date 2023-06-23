import "../Styles/form.css";
import PropTypes from "prop-types";
const Button = (props) => {
	return (
		<>
			<div className="form-container">
				<button
					onClick={props.handleSubmit}
					className=" h-9 bg-electric-blue border-[1px] border-electric-blue shadow-md text-white rounded-md desktop:text-2xl desktop:py-7 desktop:flex default:justify-center desktop:items-center"
				>
					{props.btnText}
				</button>
			</div>
		</>
	);
};
Button.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	btnText: PropTypes.string.isRequired,
};

export default Button;
