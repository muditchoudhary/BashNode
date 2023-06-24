import { FormProvider, useForm } from "react-hook-form";
import "../Styles/form.css";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";

const SignUpForm = () => {
	const navigate = useNavigate();
	const methods = useForm({
		mode: "onBlur",
	});

	const onSubmit = methods.handleSubmit(async (data) => {
		try {
			const response = await fetch("http://localhost:3000/auth/sign-up", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userName: data.name,
					email: data.email,
					password: data.password,
				}),
			});

			if (response.status === 201) {
				navigate("/");
			} else {
				console.log("failed");
			}
		} catch (error) {
			console.error(error);
		}
	});
	return (
		<>
			<FormProvider {...methods}>
				<form
					onSubmit={(e) => e.preventDefault()}
					noValidate
					className=" mx-7 mt-4 desktop:mx-28"
				>
					<Input
						id="name"
						label="User Name"
						type="text"
						placeHolder="Aman Singh"
						autoComplete="on"
						validationRules={{
							required: {
								value: true,
								message: "required",
							},
							minLength: {
								value: 4,
								message:
									"is too short (minimum is 4 characters)",
							},
						}}
					/>
					<Input
						id="email"
						label="Email"
						type="email"
						placeHolder="aman123@gmail.com"
						autoComplete="on"
						validationRules={{
							required: {
								value: true,
								message: "required",
							},
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Please Enter A Valid Email!",
							},
						}}
					/>
					<Input
						id="password"
						label="Password"
						type="text"
						validationRules={{
							required: {
								value: true,
								message: "required",
							},
							minLength: {
								value: 8,
								message: "is too short (minimum 8 characters)",
							},
							maxLength: {
								value: 16,
								message: "is too long (maximum 16 characters)",
							},
							pattern: {
								// eslint-disable-next-line no-useless-escape
								value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,16}$/i,
								message:
									"Password requires symbol, lowercase, uppercase, and number",
							},
						}}
					/>

					<Input
						id="confirmPassword"
						label="Confirm Password"
						type="text"
						validationRules={{
							required: {
								value: true,
								message: "required",
							},
							validate: (match) => {
								const password = methods.getValues("password");
								return (
									match === password ||
									"Passwords should match"
								);
							},
						}}
					/>

					<Button handleSubmit={onSubmit} btnText="Sign Up" />
				</form>
			</FormProvider>
		</>
	);
};

export default SignUpForm;
