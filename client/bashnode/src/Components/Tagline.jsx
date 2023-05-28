const Tagline = () => {
	return (
		<>
			<div
				data-testid="tagline-container"
				className=" flex flex-col items-center font-black text-sm mt-4 gap-1 desktop:text-5xl desktop:leading-relaxed desktop:mt-11 lg:text-2xl lg:mt-5"
			>
				<p>&quot;Unleash Your Words, Inspire The World&quot;</p>
				<p>With</p>
				<p className=" text-electric-blue">BashNode</p>
			</div>
		</>
	);
};

export default Tagline;
