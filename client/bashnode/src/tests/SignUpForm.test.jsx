import { render, screen } from "@testing-library/react";
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

function getUserName() {
	return screen.getByRole("textbox", { name: /user name/i });
}

function getEmail() {
	return screen.getByRole("textbox", { name: /email/i });
}

function getPassoword() {
	return screen.getByLabelText(/\*password/i );
}

function getConfirmPassword() {
	return screen.getByLabelText(/\*confirm password/i);
}

function getSignUpButton() {
	return screen.getByRole("button", { name: /sign up/i });
}
