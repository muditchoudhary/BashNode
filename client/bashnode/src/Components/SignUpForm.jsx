import { useState } from "react";
import "../Styles/form.css";
const SignUpForm = () => {
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		fetch("http://localhost:3000/auth/sign-up", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userName: userName,
				email: email,
				password: password,
			}),
		});
	};

	return (
		<>
			<form onSubmit={handleSubmit} className=" mx-7 mt-4 desktop:mx-28">
				<div className="form-container">
					<label htmlFor="name" className="form-label">
						*User Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						className="form-field"
						minLength="3"
						maxLength="100"
						placeholder="Aman Singh"
						value={userName}
						onChange={(e) => {
							setUserName(e.target.value);
						}}
					/>
				</div>

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
						placeholder="aman123@gmail.com"
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
						pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,16}"
						maxLength={16}
						title="Password must be between 8 and 16 characters, contain at least one uppercase and one lowercase letter, contain at least one symbol."
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
				</div>

				<div className="form-container">
					<label htmlFor="confirm-password" className="form-label">
						*Confirm Password
					</label>
					<input
						type="text"
						id="confirm-password"
						name="confirm-password"
						required
						className="form-field"
						pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,16}"
						title="Password must be between 8 and 16 characters, contain at least one uppercase and one lowercase letter, contain at least one symbol."
						maxLength={16}
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
						}}
					/>
				</div>

				<div className="form-container">
					<button
						type="submit"
						className=" h-9 bg-electric-blue border-[1px] border-electric-blue shadow-md text-white rounded-md desktop:text-2xl desktop:py-7 desktop:flex default:justify-center desktop:items-center"
					>
						Sign Up
					</button>
				</div>
			</form>
		</>
	);
};

export default SignUpForm;
