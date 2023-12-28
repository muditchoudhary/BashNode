import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Spinner } from "../../../common/Spinner";

import { EditorContainer } from "./EditorContainer";
import {
	BACKEND_URL,
	SERVER_RESPONSES,
} from "../../../globalConstants/constants";
import { handleResponse } from "../helpers/errorHandler";
import { useLogout } from "../../authenticaton/hooks/useLogOut";

const GET_PUBLISH_BLOG_URL = `${BACKEND_URL}blog/publish/`;

export const PublishEditor = () => {
	const [isBlogLoading, setIsBlogLoading] = useState(false);
	const {
		setCurrentPublished,
		currentPublished,
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

	const { publishedBlogId } = useParams();
	const { logOut } = useLogout();

	useEffect(() => {
		const fetchPublishedBlog = async () => {
			setIsBlogLoading(true);
			const response = await fetchBlogWithId(
				`${GET_PUBLISH_BLOG_URL}${publishedBlogId}`
			);
			if (!ignore) {
				if (response.status === SERVER_RESPONSES.OK) {
					setIsBlogLoading(false);
					setCurrentPublished(response.blog);
					setIsDraftWindow(false);
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
		if (
			publishedBlogId !== currentPublished?._id ||
			wasDraftWindow !== isDraftWindow
		) {
			fetchPublishedBlog();
		}

		return () => {
			ignore = true;
		};
	}, [publishedBlogId]);

	if (isBlogLoading || currentPublished === null) {
		return <Spinner />;
	} else {
		return (
			<>
				<EditorContainer
					currentBlog={currentPublished}
					isDraftWindow={isDraftWindow}
					setCurrentDraft={null}
					setCurrentPublished={setCurrentPublished}
					coverImg={coverImg}
					setCoverImg={setCoverImg}
					isBlogActionLoading={isBlogActionLoading}
					setIsCoverImgNull={setIsCoverImgNull}
				/>
			</>
		);
	}
};
