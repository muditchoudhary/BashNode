import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { useEffect } from "react";

const TITLE_VALIDATION = {
	required: {
		value: true,
		message: "Title is required",
	},
	maxLength: {
		value: 300,
		message: "Title is too long (maximum is 300 characters)",
	},
	minLength: {
		value: 20,
		message: "Title is too short (minimum is 20 characters)",
	},
};
const ARTICLE_VALIDATION = {
	required: {
		value: true,
		message: "Article is required",
	},
	maxLength: {
		value: 20000,
		message: "Article is too long (maximum is 20000 characters)",
	},
	minLength: {
		value: 20,
		message: "Article is too short (minimum is 20 characters)",
	},
};

export const TextEditor = ({ currentBlog }) => {
	const { register, setValue } = useFormContext();

	useEffect(() => {
		setValue("title", currentBlog.title);
		setValue("article", currentBlog.content);
	}, [currentBlog.title, currentBlog.content]);
	return (
		<>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="flex flex-col flex-1 px-3"
			>
				<textarea
					{...register("title", { ...TITLE_VALIDATION })}
					className="text-2xl font-extrabold px-1 py-3 lg:text-5xl leading-snug lg:leading-snug border-none outline-none resize-none"
					placeholder="Article Title..."
				></textarea>
				<textarea
					{...register("article", { ...ARTICLE_VALIDATION })}
					className="flex-auto text-xl px-1 py-3 lg:text-3xl leading-tight lg:leading-tight border-none outline-none resize-none"
					placeholder="Article Content..."
				></textarea>
			</form>
		</>
	);
};
TextEditor.propTypes = {
	currentBlog: PropTypes.object.isRequired,
};
