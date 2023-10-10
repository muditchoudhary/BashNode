import { useOutletContext } from "react-router-dom";
import { Avatar, Button, Dropdown } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { ReactComponent as BackArrowIcon } from "../../../assets/icons/back-arrow.svg";
import publishBlog from "../../../assets/images/publish-article.svg";

const items = [
	{
		label: "My Account",
		key: "0",
	},
	{
		type: "divider",
	},
	{
		label: "Log out",
		key: "3",
	},
];

export const BlogPreview = () => {
	const { currentDraft, currentPublished, isDraftWindow } =
		useOutletContext();
	const currentBlog = isDraftWindow ? currentDraft : currentPublished;
	console.log(currentDraft);
	const markdown = `Here is some JavaScript code:

    ~~~js
    import { Routes, Route, BrowserRouter } from "react-router-dom";

    import { HomePage } from "./pages/HomePage";
    import { RootLayout } from "./layouts/RootLayout";
    import { SignInPage } from "./pages/SignInPage";
    import { DashBoardPage } from "./pages/DashBoardPage";
    
    function App() {
        return (
            <>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<RootLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="/sign-in" element={<SignInPage />} />
                            <Route path="/dashboard" element={<DashBoardPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </>
        );
    }
    
    export default App;
    ~~~
    `;
	return (
		<>
			<div className="main-blog-preview-container border-2 border-solid border-red-800 w-full mx-auto mt-8">
				<div className="navbar py-2 pr-4  flex justify-between items-center">
					<Button
						type="text"
						shape="round"
						icon={<BackArrowIcon className="w-6 h-auto" />}
					></Button>
					<span className="flex-2 text-center">{`Joen Doe's blog`}</span>

					<Dropdown menu={{ items }} trigger={["click"]}>
						<Avatar className="cursor-pointer">U</Avatar>
					</Dropdown>
				</div>
				<div className="h-48 w-full py-2 px-4 rounded-xl lg:h-[25%]">
					<img
						src={publishBlog}
						className="w-full h-full object-cover"
					/>
				</div>

				<ReactMarkdown className="py-2 px-4 mt-8 text-center leading-snug">{`# **${currentBlog["title"]}**`}</ReactMarkdown>
				<div className="flex flex-col py-2 px-4 gap-4 mb-8">
					<div className="flex items-center justify-center gap-4">
						<Avatar className="flex-[0_0_auto]">U</Avatar>
						<span className="text-xl whitespace-nowrap overflow-hidden">
							{"Joen Doe"}
						</span>
					</div>
					<span className="text-center">
						2023-10-04T09:10:23.396+00:00
					</span>
				</div>
				<div className="py-6 px-12 mt-8 leading-snug border-2 border-solid border-blue-700">
					{/* <ReactMarkdown
						className="py-6 px-12 mt-8 leading-snug border-2 border-solid border-blue-700"
						remarkPlugins={[remarkGfm]}
					>
						{currentBlog["content"]}
					</ReactMarkdown> */}
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						children={currentBlog["content"]}
						components={{
							code(props) {
								const { children, className, node, ...rest } =
									props;
								// const codeValue = children;
								// const match = /~~~(\w+)/.exec(codeValue);
                                const match = /language-(\w+)/.exec(className || '');
                                // console.log(match)
								return match ? (
									<SyntaxHighlighter
										{...rest}
										children={String(children).replace(
											/\n$/,
											""
										)}
										language={match[1]}
										PreTag="div"
									/>
								) : (
									<code {...rest} className={className}>
										{children}
									</code>
								);
							},
						}}
					/>
				</div>
			</div>
		</>
	);
};
