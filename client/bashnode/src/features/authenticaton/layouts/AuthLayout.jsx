import { Outlet } from "react-router-dom";
import { ConfigProvider } from "antd";
import { useMediaQuery } from "react-responsive";

import publishArticleImg from "../../../assets/images/publish-article.svg";

export const AuthLayout = () => {
	const isLargeScreen = useMediaQuery({
		query: "(min-width: 1536px)",
	});

	return (
		<>
			<div className="lg:flex min-h-screen max-h-screen px-4 py-2">
				<div className="flex flex-col">
					<p className="text-electric-blue text-4xl font-bold font-nunito justify-self-center self-center flex items-center py-3 2xl:text-6xl m-0 ">
						BashNode
					</p>
					<ConfigProvider
						theme={{
							components: {
								Button: {
									fontSize: isLargeScreen ? 30 : 20,
									controlHeight: isLargeScreen ? 58 : 38,
								},
								Divider: {
									colorSplit: "#757575",
									fontSize: isLargeScreen ? 30 : 20,
								},
							},
						}}
					>
						<Outlet />
					</ConfigProvider>
				</div>
				<div className="hidden lg:flex lg:flex-col lg:flex-2">
					<div className="flex flex-col items-center font-black text-xl flex-1 justify-center py-5 2xl:text-3xl ">
						<p>&quot;Unleash Your Words, Inspire The World&quot;</p>
						<p>With</p>
						<p className=" text-electric-blue text">BashNode</p>
					</div>
					<img
						src={publishArticleImg}
						alt="A girl publishing an article"
						className=" w-2/3 h-auto self-center flex-2"
					/>
				</div>
			</div>
		</>
	);
};
