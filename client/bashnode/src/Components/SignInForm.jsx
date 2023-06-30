import { FormProvider, useForm } from "react-hook-form";
// import "../Styles/form.css";
import Input from "./Input";
import Button from "./Button";

const SignInForm = () => {
	const methods = useForm({
		mode: "onBlur",
	});

	// const { setError } = methods;

	const onSubmit = methods.handleSubmit(async (data) => {
		try {
			const response = await fetch("http://localhost:3000/auth/sign-in", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});
			const resData = await response.json();
			console.log(response);
			console.log(resData);
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
								value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
								message:
									"Password requires symbol, lowercase, uppercase, and number",
							},
						}}
					/>
					<Button handleSubmit={onSubmit} btnText="Sign In" />
				</form>
			</FormProvider>
		</>
	);
};

export default SignInForm;