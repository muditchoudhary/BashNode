import Footer from "../Components/Footer";
import Header from "../Components/Header";
import SignUpForm from "../Components/SignUpForm";
import Tagline from "../Components/Tagline";
import publishArticle from "../assets/images/publish-article.svg";
import { useMediaQuery } from "react-responsive";

const TaglineBrandComponent = () => {
	return (
		<>
			<div className="flex-2 flex flex-col items-center ">
				<Tagline />
				<img
					src={publishArticle}
					alt="Image of lady publishing article"
					className=" w-[100%] h-[70%] desktop:text-2xl lg:h-[80%]"
				/>
			</div>
		</>
	);
};
const SignUpDesktop = () => {
	return (
		<>
			<div className="flex h-screen">
				<div className="flex-1 h-max self-center">
					<Header />
					<SignUpForm />
					<Footer footerText={"Sign In to your existing account"} linkTo={"/auth/sign-in"} />
				</div>
				<TaglineBrandComponent />
			</div>
		</>
	);
};

const SignUpMobile = () => {
	return (
		<>
			<Header />
			<Tagline />
			<SignUpForm />
			<Footer footerText={"Sign In to your existing account"} linkTo={"/auth/sign-in"} />
		</>
	);
};

const SignUp = () => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	if (isDesktop) {
		return <SignUpDesktop />;
	}
	return <SignUpMobile />;
};

export { SignUp, TaglineBrandComponent };