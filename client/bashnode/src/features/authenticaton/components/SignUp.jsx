import { FormProvider, useForm } from "react-hook-form";
import { Button, Divider } from "antd";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";

import { Input } from "../components/Input";

import "../styles/form.css";

export const SignUp = () => {
	const { signUp, isLoading, validationErrors, isSignUpSuccessfull } =
		useOutletContext();

	const methods = useForm({
		mode: "onBlur",
	});

	const { setError } = methods;

	const navigate = useNavigate();

	useEffect(() => {
		if (validationErrors) {
			for (const key in validationErrors) {
				setError(key, {
					type: "manual",
					message: validationErrors[key]["msg"],
				});
			}
		}
		if (isSignUpSuccessfull) {
			navigate("/", { replace: true });
		}
	}, [validationErrors, isSignUpSuccessfull]);

	const onSubmit = methods.handleSubmit(async (data) => {
		await signUp(data.username, data.email, data.password);
	});

	return (
		<>
			<div className="sign-up-form-container flex flex-col flex-[2_2_auto] justify-center ">
				<FormProvider {...methods}>
					<form
						onSubmit={(e) => e.preventDefault()}
						noValidate
						className="flex flex-col mx-7 mt-4"
					>
						<Input
							id="username"
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
									message:
										"is too short (minimum 8 characters)",
								},
								maxLength: {
									value: 16,
									message:
										"is too long (maximum 16 characters)",
								},
								pattern: {
									// eslint-disable-next-line no-useless-escape
									value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
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
								validate: (confirmPassword) => {
									const password =
										methods.getValues("password");
									return (
										confirmPassword === password ||
										"Passwords should match"
									);
								},
							}}
						/>

						<Button
							type="primary"
							onClick={onSubmit}
							className="mt-6 2xl:mt-9"
							loading={isLoading}
						>
							Sign Up
						</Button>
					</form>
					<Divider plain>OR</Divider>
					<Link
						to={"/sign-in"}
						className=" self-center text-xl text-black hover:text-electric-blue focus:text-electric-blue active:text-electric-blue visited:text-black pb-3 2xl:text-3xl"
					>
						Sign In to create a new account
					</Link>
				</FormProvider>
			</div>
		</>
	);
};
