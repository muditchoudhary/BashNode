import { body } from "express-validator";

const TITLE_MIN_LENGTH = 20;
const TITLE_MAX_LENGTH = 300;
const CONTENT_MIN_LENGTH = 300;
const CONTENT_MAX_LENGTH = 20000;

export const blogValidation = () => {
	const createTitleChain = () => {
		return body("title")
			.trim()
			.notEmpty()
			.withMessage("Title must not be blank")
			.escape()
			.custom((value) => {
				if (value.length < TITLE_MIN_LENGTH) {
					throw new Error(
						`Title is too short (minimum is ${TITLE_MIN_LENGTH} characters)`
					);
				}
				if (value.length >= TITLE_MAX_LENGTH) {
					throw new Error(
						`Title is too long (maximum is ${TITLE_MAX_LENGTH} characters)`
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
				if (value.length < CONTENT_MIN_LENGTH) {
					throw new Error(
						`Article is too short (minimum is ${CONTENT_MIN_LENGTH} characters)`
					);
				}
				if (value.length >= CONTENT_MAX_LENGTH) {
					throw new Error(
						`Article is too long (maximum is ${CONTENT_MAX_LENGTH} characters)`
					);
				}
				return true;
			});
	};

	const validateBlogData = () => {
		return [createTitleChain(), createContentChain()];
	};

	return { validateBlogData };
};
