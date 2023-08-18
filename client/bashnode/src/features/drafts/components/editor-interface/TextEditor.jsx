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
		// border-purple border-solid
		<form
			onSubmit={(e) => e.preventDefault()}
			className="border-2 flex flex-col flex-1 "
		>
			<input
				defaultValue={
					"Hello world this is the test title and it is long"
				}
				{...register("title", { ...TITLE_VALIDATION })}
				className="flex-1"
			/>
			<textarea
				defaultValue={
					"Hello world this is the test article and it is long"
				}
				{...register("article", { ...ARTICLE_VALIDATION })}
				className="flex-[14_14_0%]"
			></textarea>
		</form>
	);
};
