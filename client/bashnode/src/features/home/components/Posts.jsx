import { useRef } from "react";
import { clsx } from "clsx";
import PropTypes from "prop-types";

import { useLazyLoad } from "../hooks/useLazyLoad";
import { BlogCard } from "./BlogCard";
import { CardLoading } from "./CardLoading";
import { BACKEND_URL } from "../../../globalConstants/constants";

// There is a bug, that the fetched posts repeats itself (meaning first 10 posts repeats themselves again), so we need to remove the duplicates
// Currently, I don't know why the fetched posts repeats itself
// Removing duplicates from an array of objects is temporary solution I get it now
// I will fix the bug later maybe
function removeDuplicates(array) {
	return array.reduce((acc, current) => {
		const x = acc.find((item) => item._id === current._id);
		if (!x) {
			return acc.concat([current]);
		} else {
			return acc;
		}
	}, []);
}

export const Posts = ({ handleOnPostClick }) => {
	const triggerRef = useRef(null);

	const onGrabData = async (currentPage) => {
		let response;
		try {
			response = await fetch(
				`${BACKEND_URL}blog/published/blogs?page=${currentPage}&limit=10`,
				{
					method: "GET",
				}
			);
			const json = await response.json();
			return json;
			// json = {
			//     "publishedBlogs": [{}], up to 10 blog posts
			//     "totalPages": 1,
			//     "currentPage": 1,
			// }
		} catch (error) {
			console.error("Error from Posts\n\n", error);
		}
	};
	const { data, loading } = useLazyLoad({ triggerRef, onGrabData });

	return (
		<>
			{removeDuplicates(data).map((blogPost) => {
				return (
					<BlogCard
						key={blogPost["_id"]}
						id={blogPost["_id"]}
						title={blogPost["title"]}
						content={blogPost["content"]}
						publishDate={blogPost["published_at"]}
						authorName={blogPost["author_name"]}
						authorAvatar={blogPost["author_avatar"]}
						coverImg={blogPost["cover_img"]}
						likes={blogPost["likes"]}
						handleOnPostClick={handleOnPostClick}
					/>
				);
			})}
			<div
				ref={triggerRef}
				className={clsx(
					{ trigger: true },
					{ visible: loading },
					{ "w-full": true }
				)}
			>
				<CardLoading />
				<CardLoading />
				<CardLoading />
				<CardLoading />
				<CardLoading />
				<CardLoading />
			</div>
		</>
	);
};
Posts.propTypes = {
	handleOnPostClick: PropTypes.func.isRequired,
};
