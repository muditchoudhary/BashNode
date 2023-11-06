import { body } from "express-validator";

export const draftValidation = () => {
	const createTitleChain = () => {
		return body("title")
			.trim()
			.notEmpty()
			.withMessage("Title must not be blank")
			.escape()
			.custom((value) => {
				if (value.length < 20) {
					throw new Error(
						"Title is too short (minimum is 20 characters)"
					);
				}
				if (value.length >= 300) {
					throw new Error(
						"Title is too long (maximum is 300 characters)"
					);
				}
				return true;
			});
	};
	const createContentChain = () => {
		return body("content")
			.trim()
			.notEmpty()
			.withMessage("Article must not be blank")
			.escape()
			.custom((value) => {
				if (value.length < 300) {
					throw new Error(
						"Article is too short (minimum is 300 characters)"
					);
				}
				if (value.length >= 20000) {
					throw new Error(
						"Article is too long (maximum is 20000 characters)"
					);
				}
				return true;
			});
	};

	const saveDraftValidate = () => {
		return [createTitleChain(), createContentChain()];
	};

	return { saveDraftValidate };
};
