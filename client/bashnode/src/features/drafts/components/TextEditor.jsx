import { useFormContext } from "react-hook-form";

const TITLE_VALIDATION = {
	required: {
		value: true,
		message: "required",
	},
	maxLength: {
		value: 300,
		message: "is too long (maximum is 300 characters)",
	},
	minLength: {
		value: 20,
		message: "is too short (minimum is 20 characters)",
	},
};
const ARTICLE_VALIDATION = {
	required: {
		value: true,
		message: "required",
	},
	maxLength: {
		value: 20000,
		message: "is too long (maximum is 20000 characters)",
	},
	minLength: {
		value: 20,
		message: "is too short (minimum is 20 characters)",
	},
};

export const TextEditor = () => {
	const { register } = useFormContext();
	return (
		<>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="flex flex-col flex-1 px-3"
			>
				<textarea
					defaultValue={
						"Hello world this is the test title and it is long"
					}
					{...register("title", { ...TITLE_VALIDATION })}
					className="text-2xl font-extrabold px-1 py-3 lg:text-5xl leading-snug lg:leading-snug border-none outline-none resize-none"
					placeholder="Article Title..."
					required={TITLE_VALIDATION["required"]["value"]}
					maxLength={TITLE_VALIDATION["maxLength"]["value"]}
					minLength={TITLE_VALIDATION["minLength"]["value"]}
				></textarea>
				<textarea
					defaultValue={
						"Hello world this is the test article and it is long"
					}
					{...register("article", { ...ARTICLE_VALIDATION })}
					className="flex-1 text-xl px-1 py-3 lg:text-3xl leading-tight lg:leading-tight border-none outline-none resize-none"
					placeholder="Article Content..."
					required={ARTICLE_VALIDATION["required"]["value"]}
					maxLength={ARTICLE_VALIDATION["maxLength"]["value"]}
					minLength={ARTICLE_VALIDATION["minLength"]["value"]}
				></textarea>
			</form>
		</>
	);
};
