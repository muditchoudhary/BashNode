import PropTypes from "prop-types";

import { ActionBar } from "./Actionbar";
import { TextEditor } from "./TextEditor";

export const EditorContainer = ({
	currentBlog,
	isDraftWindow,
	setCurrentDraft,
	setCurrentPublished,
	coverImg,
    setCoverImg,
}) => {
	return (
		<div className="editor-container gap-2 p-2 borer-2 flex flex-col flex-1">
			<ActionBar
				coverImg={coverImg}
                setCoverImg={setCoverImg}
			/>
			<TextEditor
				currentBlog={currentBlog}
				isDraftWindow={isDraftWindow}
				setCurrentDraft={setCurrentDraft}
				setCurrentPublished={setCurrentPublished}
			/>
		</div>
	);
};
EditorContainer.propTypes = {
	currentBlog: PropTypes.object.isRequired,
	isDraftWindow: PropTypes.bool.isRequired,
	setCurrentDraft: PropTypes.func,
	setCurrentPublished: PropTypes.func,
	coverImg: PropTypes.object,
    setCoverImg: PropTypes.func.isRequired,
};
