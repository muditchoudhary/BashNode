import { render, screen } from "@testing-library/react";
import Header from "../Components/Header";

/*global test, expect*/
test("render Header component", () => {
	render(<Header />);

	expect(screen.getByText("BashNode")).toBeInTheDocument();
});
