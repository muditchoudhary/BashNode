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
    isBlogActionLoading,
    setIsCoverImgNull,
}) => {
	return (
		<div className="gap-2 px-2 py-2 flex flex-col flex-1">
			<ActionBar
				coverImg={coverImg}
                setCoverImg={setCoverImg}
                isBlogActionLoading={isBlogActionLoading}
                setIsCoverImgNull={setIsCoverImgNull}
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
    coverImg: PropTypes.any,
    setCoverImg: PropTypes.func.isRequired,
    isBlogActionLoading: PropTypes.bool.isRequired,
    setIsCoverImgNull: PropTypes.func.isRequired,
};
