import { render, screen } from "@testing-library/react";
import Tagline from "../Components/Tagline";

/*global test, expect*/
test("render Tagline component", () => {
	render(<Tagline />);

	const taglineContainer = screen.getByTestId("tagline-container");
	const sentenceOne = screen.getByText(/"unleash your words.*? world"/i);
	const sentenceTwo = screen.getByText(/with/i);
	const sentenceThree = screen.getByText(/bashnode/i);

	expect(taglineContainer).toBeInTheDocument();
	expect(sentenceOne).toBeInTheDocument();
	expect(sentenceTwo).toBeInTheDocument();
	expect(sentenceThree).toBeInTheDocument();
});
