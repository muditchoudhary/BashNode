import "../Styles/form.css";
import PropTypes from "prop-types";
import "../Styles/button.css";

const Button = (props) => {
	return (
		<>
			<div className="form-container">
				<button onClick={props.handleSubmit} className="button">
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
