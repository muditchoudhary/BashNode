import PropTypes from "prop-types";

import { ActionBar } from "./Actionbar";
import { TextEditor } from "./TextEditor";

export const EditorContainer = ({ currentBlog }) => {
	return (
		<div className="editor-container gap-2 p-2 borer-2 flex flex-col flex-1">
			<ActionBar />
			<TextEditor currentBlog={currentBlog} />
		</div>
	);
};
EditorContainer.propTypes = {
	currentBlog: PropTypes.object.isRequired,
};
