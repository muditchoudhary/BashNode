const Lines = () => {
	return (
		<div className="flex items-center">
			<span className="border-[1px] border-black w-24 "></span>
		</div>
	);
};
const OrDivider = () => {
	return (
		<>
			<div className="flex justify-center gap-2">
                <Lines />
				<span>OR</span>
				<Lines />
			</div>
		</>
	);
};
const Footer = () => {
	return (
		<>
			<div className="flex flex-col items-center gap-7">
				<OrDivider />
				<a href="#">Sign in to your existing account</a>
			</div>
		</>
	);
};

export default Footer;
