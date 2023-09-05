import { ActionBar } from "./Actionbar";
import { TextEditor } from "./TextEditor";

export const EditorContainer = () => {
	return (
        // border-green-800 border-solid
		<div className="editor-container gap-2 p-2 borer-2 flex flex-col flex-1 ">
			<ActionBar />
			<TextEditor />
		</div>
	);
};