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
			<div className="lg:flex min-h-screen max-h-screen px-4 py-2 4k:px-14 4k:py-7">
				<div className="flex flex-col lg:w-1/3">
					<p className="text-electric-blue text-2xl xl:text-4xl 4k:text-5xl font-bold font-nunito justify-self-center self-center flex items-center py-3 4k:py-6 2xl:text-4xl m-0 ">
						BashNode
					</p>
					<ConfigProvider
						theme={{
							components: {
								Divider: {
									colorSplit: "#757575",
									fontSize: isLargeScreen ? 18 : 14,
								},
							},
						}}
					>
						<Outlet />
					</ConfigProvider>
				</div>
				<div className="hidden lg:flex lg:flex-col lg:w-8/12">
					<div className="flex flex-col lg:h-1/4 2xl:h-1/5 4k:h-1/6 font-roboto items-center font-black text-xl justify-evenly 2xl:text-2xl 4k:text-3xl">
						<p className="m-0">
							&quot;Unleash Your Words, Inspire The World&quot;
						</p>
						<p className="m-0">With</p>
						<p className=" m-0 text-electric-blue text-2xl 2xl:text-3xl 4k:text-5xl">
							BashNode
						</p>
					</div>
					<div className=" lg:h-3/4 2xl:h-4/5 4k:h-5/6">
						<img
							src={publishArticleImg}
							alt="A girl publishing an article"
							className="w-full h-full object-cover"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
