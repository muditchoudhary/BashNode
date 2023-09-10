import { FormProvider, useForm } from "react-hook-form";
import { Button, Divider } from "antd";
import {
	Link,
	useOutletContext,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import { Input } from "../components/Input";

export const SignIn = () => {
	const { handleAuth, isLoading, validationErrors, isAuthSuccessfull } =
		useOutletContext();

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
		await handleAuth(data.email, data.password);
	});

	return (
		<>
			<div className="sign-in-form-container flex flex-col flex-[2_2_auto] justify-center">
				<FormProvider {...methods}>
					<form
						onSubmit={(e) => e.preventDefault()}
						noValidate
						className="flex flex-col mx-7 mt-4"
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
								maxLength: {
									value: 16,
									message:
										"is too long (maximum 16 characters)",
								},
							}}
						/>
						<Button
							type="primary"
							onClick={onSubmit}
							className="mt-6 2xl:mt-9"
							loading={isLoading}
						>
							Sign In
						</Button>
					</form>
				</FormProvider>
				<Divider plain>OR</Divider>
				<Link
					to={"/sign-up"}
					className=" self-center text-xl text-black hover:text-electric-blue focus:text-electric-blue active:text-electric-blue visited:text-black pb-3 2xl:text-3xl"
				>
					Sign Up to create a new account
				</Link>
			</div>
		</>
	);
};
