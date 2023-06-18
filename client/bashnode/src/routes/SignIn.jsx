import SignInForm from "../Components/SignInForm";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { TaglineBrandComponent } from "./sign-up";
import Tagline from "../Components/Tagline";
import { useMediaQuery } from "react-responsive";

const SignInDesktop = () => {
	return (
		<>
			<div className="flex h-screen">
				<div className="flex-1 h-max self-center">
					<Header />
					<SignInForm />
					<Footer
						footerText={"Sign Up to create a new account"}
						linkTo={"/auth/sign-up"}
					/>
				</div>
				<TaglineBrandComponent />
			</div>
		</>
	);
};

const SignInMobile = () => {
	return (
		<>
			<Header />
			<Tagline />
			<SignInForm />
			<Footer
				footerText={"Sign Up to create a new account"}
				linkTo={"/auth/sign-up"}
			/>
		</>
	);
};

const SignIn = () => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	if (isDesktop) {
		return <SignInDesktop />;
	}
	return <SignInMobile />;
};

export default SignIn;
