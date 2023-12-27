import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { useEffect } from "react";
import he from "he";

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
		value: 300,
		message: "Article is too short (minimum is 300 characters)",
	},
};

export const TextEditor = ({
	currentBlog,
	isDraftWindow,
	setCurrentDraft,
	setCurrentPublished,
}) => {
	const { register, setValue } = useFormContext();

	const updateTitle = (e) => {
		if (isDraftWindow) {
			setCurrentDraft((prev) => ({
				...prev,
				title: e.target.value,
			}));
		} else {
			setCurrentPublished((prev) => ({
				...prev,
				title: e.target.value,
			}));
		}
	};

	const updateConent = (e) => {
		if (isDraftWindow) {
			setCurrentDraft((prev) => ({
				...prev,
				content: e.target.value,
			}));
		} else {
			setCurrentPublished((prev) => ({
				...prev,
				content: e.target.value,
			}));
		}
	};

	const debounce = (func, delay) => {
		let timeout;
		return function (...args) {
			const context = this;
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(context, args), delay);
		};
	};

	useEffect(() => {
		setValue("title", he.decode(currentBlog.title));
		setValue("article", he.decode(currentBlog.content));
	}, []);
	// console.log(currentBlog);
	return (
		<>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="flex flex-col flex-1 gap-2"
			>
				<textarea
					{...register("title", { ...TITLE_VALIDATION })}
					className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-roboto font-extrabold px-1 py-3  outline-none resize-none box-border h-[20vh] 2xl:h-[10vh] border-none"
					placeholder="Article Title..."
					onChange={debounce(updateTitle, 1000)}
				></textarea>
				<textarea
					{...register("article", { ...ARTICLE_VALIDATION })}
					className="text-base md:text-lg lg:text-xl  font-roboto px-1 py-3 outline-none resize-none box-border h-[80vh] 2xl:h-[90vh] border-none"
					placeholder="Article Content..."
					onChange={debounce(updateConent, 1000)}
				></textarea>
			</form>
		</>
	);
};
TextEditor.propTypes = {
	currentBlog: PropTypes.object.isRequired,
	setCurrentDraft: PropTypes.func,
	setCurrentPublished: PropTypes.func,
	isDraftWindow: PropTypes.bool.isRequired,
};
