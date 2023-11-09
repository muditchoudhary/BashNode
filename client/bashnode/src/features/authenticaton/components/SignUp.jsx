import { FormProvider, useForm } from "react-hook-form";
import { Button, Divider } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { Input } from "../components/Input";
import { SERVER_RESPONSES } from "../../../globalConstants/constants";
import { FETCH_STATUS } from "../../../globalConstants/constants";
import { useSignUp } from "../hooks/useSignUp";

import "../styles/form.css";


export const SignUp = () => {
	const { handleAuth, isLoading, validationErrors, isAuthSuccessfull } =
		useSignUp();

	const methods = useForm({
		mode: "onBlur",
	});

	const { setError } = methods;

	const navigate = useNavigate();
	const location = useLocation();

	const from = location?.state?.from?.pathname || "/";

	useEffect(() => {
		if (validationErrors) {
			for (const key in validationErrors) {
				setError(key, {
					type: "manual",
					message: validationErrors[key]["msg"],
				});
			}
		}
		if (isAuthSuccessfull) {
			navigate(from, { replace: true });
		}
	}, [validationErrors, isAuthSuccessfull]);

	const onSubmit = methods.handleSubmit(async (data) => {
		const response = await handleAuth(data.username, data.email, data.password);
        switch (response["status"]) {
            case SERVER_RESPONSES.INTERNAL_SERVER_ERROR:
            case FETCH_STATUS.FETCH_FAIL:
                toast.error(response["errorMessage"]);
                break;
        }
	});

	return (
		<>
			<div className="flex flex-col">
				<FormProvider {...methods}>
					<form
						onSubmit={(e) => e.preventDefault()}
						noValidate
						className="flex flex-col mt-4"
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
							type="password"
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
							type="password"
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
						className=" self-center text-base xl:text-xl font-roboto text-black hover:text-electric-blue focus:text-electric-blue active:text-electric-blue visited:text-black pb-3 4k:text-2xl"
					>
						Sign In to your existing account
					</Link>
				</FormProvider>
			</div>
		</>
	);
};
