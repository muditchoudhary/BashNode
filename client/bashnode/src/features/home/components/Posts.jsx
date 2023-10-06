import { useRef } from "react";
import { clsx } from "clsx";

import { useLazyLoad } from "../hooks/useLazyLoad";
import { BlogCard } from "./BlogCard";
import { CardLoading } from "./CardLoading";

export const Posts = () => {
	const triggerRef = useRef(null);

	const onGrabData = async (currentPage) => {
		let response;
		try {
			response = await fetch(
				`http://localhost:3000/blog/published/blogs?page=${currentPage}&limit=10`,
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
			{data.map((blogPost) => {
				return (
					<BlogCard
						key={blogPost["_id"]}
						title={blogPost["title"]}
						content={blogPost["content"]}
						publishDate={blogPost["published_at"]}
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
			</div>
		</>
	);
};
