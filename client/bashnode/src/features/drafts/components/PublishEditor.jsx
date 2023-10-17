import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import { useAuthContext } from "../../../hooks/useAuthContext";
import { Spinner } from "../../../common/Spinner";

import { EditorContainer } from "./EditorContainer";

export const PublishEditor = () => {
	const [isBlogLoading, setIsBlogLoading] = useState(false);

	const {
		setCurrentPublished,
		currentPublished,
		setIsDraftWindow,
		isDraftWindow,
	} = useOutletContext();

	const { user } = useAuthContext();

	const { publishedBlogId } = useParams();

	useEffect(() => {
		const fetchPublishedBlogs = async () => {
			setIsBlogLoading(true);
			let response;
			try {
				response = await fetch(
					`http://localhost:3000/blog/publish/${publishedBlogId}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				);
				const json = await response.json();
				if (!ignore) {
					setIsBlogLoading(false);
					setCurrentPublished(json);
					setIsDraftWindow(false);
				}
			} catch (error) {
				console.error("Error from PublishEditor\n\n", error);
				toast.error("Working fine!");
			}
		};
		let ignore = false;
		if (publishedBlogId !== currentPublished?._id) {
			fetchPublishedBlogs();
		}

		return () => {
			ignore = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				/>
			</>
		);
	}
};
