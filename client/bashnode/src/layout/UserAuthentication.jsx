import { Header } from "../Components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Tagline from "../Components/Tagline";
import { useMediaQuery } from "react-responsive";
import TaglineBrand from "../Components/TaglineBrand";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const SIGN_UP_PATH = "/auth/sign-up";
const SIGN_IN_PATH = "/auth/sign-in";

const UserAuthenticationMobile = (props) => {
	return (
		<>
			<Header />
			<Tagline />
			<Outlet />
			<Footer footerText={props.footerText} linkTo={props.linkTo} />
		</>
	);
};
UserAuthenticationMobile.propTypes = {
	footerText: PropTypes.string.isRequired,
	linkTo: PropTypes.string.isRequired,
};

const UserAuthenticationDesktop = (props) => {
	return (
		<>
			<div className="flex h-screen">
				<div className="flex-1 h-max self-center">
					<Header />
					<Outlet />
					<Footer
						footerText={props.footerText}
						linkTo={props.linkTo}
					/>
				</div>
				<TaglineBrand img={props.img} />
			</div>
		</>
	);
};
UserAuthenticationDesktop.propTypes = {
	footerText: PropTypes.string.isRequired,
	linkTo: PropTypes.string.isRequired,
	img: PropTypes.string.isRequired,
};
function updatePropsBasedOnPath(props, pathName) {
	if (pathName === SIGN_UP_PATH) {
		const footerText = props.footerText.signUp;
		const linkTo = props.linkTo.signUp;
		props = { ...props, footerText: footerText, linkTo: linkTo };
	} else if (pathName === SIGN_IN_PATH) {
		const footerText = props.footerText.signIn;
		const linkTo = props.linkTo.signIn;
		props = { ...props, footerText: footerText, linkTo: linkTo };
	}
	return props;
}
const UserAuthentication = (props) => {
	const isDesktop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const location = useLocation();
	const pathName = location.pathname;

	const adjustedProps = updatePropsBasedOnPath(props, pathName);

	if (isDesktop) {
		return (
			<UserAuthenticationDesktop
				footerText={adjustedProps.footerText}
				linkTo={adjustedProps.linkTo}
				img={adjustedProps.img}
			/>
		);
	}
	return (
		<UserAuthenticationMobile
			footerText={adjustedProps.footerText}
			linkTo={adjustedProps.linkTo}
		/>
	);
};
UserAuthentication.propTypes = {
	footerText: PropTypes.object.isRequired,
	linkTo: PropTypes.object.isRequired,
	img: PropTypes.string.isRequired,
};

export default UserAuthentication;
