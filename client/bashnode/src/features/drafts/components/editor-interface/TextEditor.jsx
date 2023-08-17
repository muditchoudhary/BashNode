import { useForm } from "react-hook-form";

export const TextEditor = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => console.log(data);

	console.log(watch("title"));
	return (
		// border-purple border-solid
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="border-2 flex flex-col flex-1 "
		>
			<input defaultValue={"test"} {...register("title")} className="flex-1" />
			<textarea
				defaultValue={"text textbox"}
				{...register("draft-writing")}
                className="flex-[14_14_0%]"
			></textarea>
		</form>
	);
};
