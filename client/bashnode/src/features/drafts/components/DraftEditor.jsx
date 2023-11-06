import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { useAuthContext } from "../../../hooks/useAuthContext";
import { Spinner } from "../../../common/Spinner";

import { EditorContainer } from "./EditorContainer";

export const DraftEditor = () => {
	const [isDraftLoading, setIsDraftLoading] = useState(false);

	const { user } = useAuthContext();
	const {
		setCurrentDraft,
		currentDraft,
		setIsDraftWindow,
		isDraftWindow,
		coverImg,
        setCoverImg,
	} = useOutletContext();

	const { draftId } = useParams();

	useEffect(() => {
		const fetchDraft = async () => {
			setIsDraftLoading(true);
			let response;
			try {
				response = await fetch(
					`http://localhost:3000/blog/draft/${draftId}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				);
				const json = await response.json();
				if (!ignore) {
					setIsDraftLoading(false);
					setCurrentDraft(json);
					setIsDraftWindow(true);
                    setCoverImg(json["cover_img"]);
				}
			} catch (error) {
				console.error("Error from DraftEditor\n\n", error);
			}
		};
		let ignore = false;
		if (draftId !== currentDraft?._id) {
			fetchDraft();
		}

		return () => {
			ignore = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				/>
			</>
		);
	}
};
