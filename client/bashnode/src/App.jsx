import Footer from "./Components/Footer";
import Header from "./Components/Header";
import SignUpForm from "./Components/SignUpForm";
import Tagline from "./Components/Tagline";
import publishArticle from "./assets/images/publish-article.svg";
import { useMediaQuery } from "react-responsive";

const AppForDesktop = () => {
	return (
		<>
			<div className="flex h-screen">
				<div className="flex-1 h-max self-center">
					<Header />
					<SignUpForm />
					<Footer />
				</div>
				<div className="flex-2 flex flex-col items-center">
					<Tagline />
					<img
						src={publishArticle}
						alt="Image of lady publishing article"
						className=" w-[100%] h-[70%] desktop:text-2xl"
					/>
				</div>
			</div>
		</>
	);
};

function App() {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1440px) and (min-height: 1024px)",
	});
	if (isDesktop) {
		return <AppForDesktop />;
	}
	return (
		<>
			<Header />
			<Tagline />
			<SignUpForm />
			<Footer />
		</>
	);
}

export default App;
