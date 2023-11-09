import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { MdError } from "react-icons/md";

import { findInputError } from "../helpers/findInputError";
import { isFormInvalid } from "../helpers/isFormInvalid";

import "../styles/form.css";

export const Input = (props) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
    
	const inputError = findInputError(errors, props.id);
	const isInvalid = isFormInvalid(inputError);
	return (
		<>
			<div className="flex flex-col mt-3 2xl:mt-9">
				<label
					htmlFor={props.id}
					className=" text-base xl:text-xl font-roboto my-2 4k:text-2xl text-midnight-slate 4k:my-4"
				>
					*{props.label}
				</label>
				<input
					type={props.type}
					id={props.id}
					className={
						isInvalid
							? "form-field form-field-invalid"
							: "form-field font-roboto"
					}
					placeholder={props.placeHolder ? props.placeHolder : " "}
					autoComplete={
						props.autoComplete ? props.autoComplete : "off"
					}
					{...register(props.id, props.validationRules)}
				/>
				<AnimatePresence mode="wait" initial={false}>
					{isInvalid && (
						<InputError
							message={inputError.error.message}
							key={inputError.error.message}
						/>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};
Input.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	placeHolder: PropTypes.string,
	autoComplete: PropTypes.string,
	validationRules: PropTypes.object.isRequired,
};

const InputError = (props) => {
	return (
		<>
			<motion.p
				className=" flex items-center font-roboto gap-1 text-base my-2 4k:my-4 font-semibold text-red-500 4k:text-2xl"
				{...frame_error}
			>
				<MdError />
				{props.message}
			</motion.p>
		</>
	);
};
InputError.propTypes = {
	message: PropTypes.string,
};

const frame_error = {
	initial: { opacity: 1, y: 0 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 10 },
	transition: { duration: 0.2 },
};

