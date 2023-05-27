import { render, screen } from "@testing-library/react";
import Header from "../Components/Header";

/*global test, expect*/
test("render Header component", () => {
	render(<Header />);

	const headerComponent = screen.getByTestId("header");
	const companyLogo = screen.getByAltText(/bashnode.*? logo/i);
	const CompanyName = screen.getByText(/bashnode/i);

	expect(headerComponent).toBeInTheDocument();
	expect(companyLogo).toBeInTheDocument();
	expect(CompanyName).toBeInTheDocument();
	expect(CompanyName).toHaveTextContent(/bashnode/i);
});
