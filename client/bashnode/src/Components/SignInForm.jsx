import { useState } from "react";
import "../Styles/form.css";

const SignInForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	return (
		<>
			<form className=" mx-7 mt-4 desktop:mx-28">
				<div className="form-container">
					<label htmlFor="email" className="form-label">
						*Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						className="form-field"
						minLength="3"
						maxLength="100"
						placeholder="Aman Singh"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div className="form-container">
					<label htmlFor="password" className="form-label">
						*Password
					</label>
					<input
						type="text"
						id="password"
						name="password"
						required
						className="form-field"
						maxLength={16}
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
				</div>
				<div className="form-container">
					<button
						type="submit"
						className=" h-9 bg-electric-blue border-[1px] border-electric-blue shadow-md text-white rounded-md desktop:text-2xl desktop:py-7 desktop:flex default:justify-center desktop:items-center"
					>
						Sign In
					</button>
				</div>
			</form>
		</>
	);
};

export default SignInForm;