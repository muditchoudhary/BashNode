import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { Spinner } from "../../../common/Spinner";

import { EditorContainer } from "./EditorContainer";
import {
	SERVER_RESPONSES,
	BACKEND_URL,
} from "../../../globalConstants/constants";
import { handleResponse } from "../helpers/errorHandler";
import { useLogout } from "../../authenticaton/hooks/useLogOut";

const GET_DRAFT_URL = `${BACKEND_URL}blog/draft/`;

export const DraftEditor = () => {
	const [isDraftLoading, setIsDraftLoading] = useState(false);

	const {
		setCurrentDraft,
		currentDraft,
		setIsDraftWindow,
		isDraftWindow,
		coverImg,
		setCoverImg,
		setIsPreviewWindow,
		isBlogActionLoading,
		fetchBlogWithId,
		setIsCoverImgNull,
		wasDraftWindow,
	} = useOutletContext();

	const { draftId } = useParams();
	const { logOut } = useLogout();

	useEffect(() => {
		const fetchDraft = async () => {
			setIsDraftLoading(true);
			const response = await fetchBlogWithId(
				`${GET_DRAFT_URL}${draftId}`
			);
			if (!ignore) {
				if (response.status === SERVER_RESPONSES.OK) {
					setIsDraftLoading(false);
					setCurrentDraft(response.blog);
					setIsDraftWindow(true);
					setIsPreviewWindow(false);
					setCoverImg(response.blog["cover_img"]);
					if (response.blog["cover_img"] !== "") {
						setIsCoverImgNull(false);
					}
				} else if (response.status === SERVER_RESPONSES.UNAUTHORIZED) {
					response["message"] = "Token expired. Please login again";
					logOut();
				}
				handleResponse(response);
			}
		};
		let ignore = false;
		// If we switch from publish to draft or vice versa, we need to fetch the data again
		// that is why wasDraftWindow is used to know if earlier window is publised window or draft window

		if (draftId !== currentDraft?._id || wasDraftWindow === false) {
			fetchDraft();
		}

		return () => {
			ignore = true;
		};
	}, [draftId]);

	if (isDraftLoading || currentDraft === null) {
		return <Spinner />;
	} else {
		return (
			<>
				<EditorContainer
					currentBlog={currentDraft}
					isDraftWindow={isDraftWindow}
					setCurrentDraft={setCurrentDraft}
					coverImg={coverImg}
					setCoverImg={setCoverImg}
					isBlogActionLoading={isBlogActionLoading}
					setIsCoverImgNull={setIsCoverImgNull}
				/>
			</>
		);
	}
};
