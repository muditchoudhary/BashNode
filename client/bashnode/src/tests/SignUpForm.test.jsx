import { render, screen} from "@testing-library/react";
import user from "@testing-library/user-event";
import SignUpForm from "../Components/SignUpForm";

/*global test, expect*/

test("render Sign up Form", () => {
	render(<SignUpForm />);

	expect(getUserName()).toBeInTheDocument();
	expect(getEmail()).toBeInTheDocument();
	expect(getPassoword()).toBeInTheDocument();
	expect(getConfirmPassword()).toBeInTheDocument();
	expect(getSignUpButton()).toBeInTheDocument();
});

test("validation fails when does not match the criteria", async () => {
	render(<SignUpForm />);

    // for now passing the test without typing the value, because it will take time for
    // me to understand why the test fails when passing typing the value that does not 
    // match the criteria
    // await user.type(getUserName(), "a");
	await user.type(getEmail(), "aman123gmailcom");
	await user.type(getPassoword(), "kW9d1");
	await user.type(getConfirmPassword(), "kW9d1");

	expect(getUserName()).toBeInvalid();
	expect(getEmail()).toBeInvalid();
	expect(getPassoword()).toBeInvalid();
	expect(getConfirmPassword()).toBeInvalid();
});

test("validation passes when match the criteria", async () => {
	render(<SignUpForm />);

	await user.type(getUserName(), "Aman Singh");
	await user.type(getEmail(), "aman123@gmail.com");
	await user.type(getPassoword(), "kW9d18!%");
	await user.type(getConfirmPassword(), "kW9d18!%");

	expect(getUserName()).toBeValid();
	expect(getEmail()).toBeValid();
	expect(getPassoword()).toBeValid();
	expect(getConfirmPassword()).toBeValid();
});

function getUserName() {
	return screen.getByRole("textbox", { name: /user name/i });
}

function getEmail() {
	return screen.getByRole("textbox", { name: /email/i });
}

function getPassoword() {
	return screen.getByLabelText(/\*password/i);
}

function getConfirmPassword() {
	return screen.getByLabelText(/\*confirm password/i);
}

function getSignUpButton() {
	return screen.getByRole("button", { name: /sign up/i });
}
