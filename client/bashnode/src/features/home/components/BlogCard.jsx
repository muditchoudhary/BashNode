import { Avatar } from "antd";
import { useMediaQuery } from "react-responsive";
import { format } from "date-fns";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import he from "he";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import demoCoverImg from "../../../assets/images/publish-article.svg";
import BlankDocument from "../../../assets/images/image-file.svg"
export const BlogCard = ({
	id,
	title,
	content,
	publishDate,
	authorName,
	authorAvatar,
	coverImg,
	likes,
	handleOnPostClick,
}) => {
	const isSMScreen = useMediaQuery({ query: "(max-width: 767px)" });
	const isMDScreen = useMediaQuery({ query: "(min-width: 768px)" });
	return (
		<>
			<div
				className="w-full lg:max-w-full flex flex-col gap-3 border border-solid border-gray-400 py-1 px-2 rounded-xl cursor-pointer hover:shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] "
				onClick={() => handleOnPostClick(id)}
			>
				<div className="flex items-center">
					{authorAvatar === "" ||
						(authorAvatar === undefined && <Avatar className="border border-solid border-gray-500">U</Avatar>)}
					{authorAvatar !== undefined && authorAvatar !== "" && (
						<Avatar src={authorAvatar} className="border border-solid border-gray-500" />
					)}
					<div className="text-sm ml-4">
						<p className="text-gray-900 leading-none my-1">
							{authorName}
						</p>
						<p className="text-gray-600 m-0">
							{format(new Date(publishDate), "dd-MMM-yyyy")}
						</p>
					</div>
				</div>
				{isMDScreen && (
					<>
						<div className=" flex justify-between">
							<div className="bg-white rounded-b flex flex-col gap-3 leading-normal flex-2">
								<div className="text-gray-900 font-bold line-clamp-2">
									{title}
								</div>
								<div className="text-gray-700 text-base line-clamp-4">
									{he.decode(content)}
								</div>
							</div>
							<div className="h-48 w-full rounded-xl overflow-hidden flex-1">
								{coverImg === "undefined" ||
									(coverImg === "" && (
										<img
											src={BlankDocument}
											className="w-full h-full object-contain"
										/>
									))}
								{coverImg !== "undefined" &&
									coverImg !== "" && (
										<img
											src={coverImg}
											className="w-full h-full object-cover"
										/>
									)}
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
							{coverImg === "undefined" ||
								(coverImg === "" && (
									<img
										src={BlankDocument}
										className="w-full h-full object-contain"
									/>
								))}
							{coverImg !== "undefined" && coverImg !== "" && (
								<img
									src={coverImg}
									className="w-full h-full object-cover"
								/>
							)}
						</div>
					</>
				)}

				<div className="flex items-center py-1 px-2">
					<p className="text-gray-600 m-0 text-sm">Likes {likes}</p>
				</div>
			</div>
		</>
	);
};
BlogCard.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	publishDate: PropTypes.string.isRequired,
	authorName: PropTypes.string.isRequired,
	authorAvatar: PropTypes.string,
	coverImg: PropTypes.string,
	likes: PropTypes.number.isRequired,
	handleOnPostClick: PropTypes.func.isRequired,
};
