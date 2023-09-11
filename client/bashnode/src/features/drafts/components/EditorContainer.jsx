import PropTypes from "prop-types";

import { ActionBar } from "./Actionbar";
import { TextEditor } from "./TextEditor";

export const EditorContainer = ({ currentDraft }) => {
	return (
		<div className="editor-container gap-2 p-2 borer-2 flex flex-col flex-1">
			<ActionBar />
			<TextEditor currentDraft={currentDraft} />
		</div>
	);
};
EditorContainer.propTypes = {
	currentDraft: PropTypes.object.isRequired,
};
