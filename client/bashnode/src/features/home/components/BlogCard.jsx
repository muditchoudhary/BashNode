import { Avatar } from "antd";
import { useMediaQuery } from "react-responsive";
import PropTypes from "prop-types";

import publishBlog from "../../../assets/images/publish-article.svg";

export const BlogCard = ({ title, content, publishDate }) => {
	const isSMScreen = useMediaQuery({ query: "(max-width: 767px)" });
	const isMDScreen = useMediaQuery({ query: "(min-width: 768px)" });
	return (
		<>
			<div className="w-full lg:max-w-full flex flex-col gap-3 border border-solid border-gray-400 py-1 px-2 rounded-xl">
				<div className="flex items-center">
					<Avatar>U</Avatar>
					<div className="text-sm ml-4">
						<p className="text-gray-900 leading-none my-1">
							Keshu Jangid
						</p>
						<p className="text-gray-600 m-0">{publishDate}</p>
					</div>
				</div>
				{isMDScreen && (
					<>
						<div className=" flex justify-between">
							<div className="bg-white rounded-b flex flex-col gap-3 leading-normal flex-2">
								<div className="text-gray-900 font-bold line-clamp-2">
									{title}
								</div>
								<p className="text-gray-700 text-base line-clamp-4">
									{content}
								</p>
							</div>
							<div className="h-48 w-full rounded-xl overflow-hidden flex-1">
								<img
									src={publishBlog}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</>
				)}
				{isSMScreen && (
					<>
						<div className="bg-white rounded-b flex flex-col justify-between leading-normal">
							<div className="text-gray-900 font-bold line-clamp-2">
								{title}
							</div>
						</div>
						<div className="h-48 w-full flex-none rounded-xl overflow-hidden">
							<img
								src={publishBlog}
								className="w-full h-full object-cover"
							/>
						</div>
					</>
				)}

				<div className="flex items-center py-1 px-2">
					<p className="text-gray-600 m-0 text-sm">likes 999</p>
				</div>
			</div>
		</>
	);
};
BlogCard.propTypes = {
	title: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	publishDate: PropTypes.string.isRequired,
};