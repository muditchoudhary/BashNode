import Tagline from "./Tagline";
import PropTypes from "prop-types";
const TaglineBrand = (props) => {
	return (
		<>
			<div className="flex-2 flex flex-col items-center ">
				<Tagline />
				<img
					src={props.img}
					alt="Image of lady publishing article"
					className=" w-[100%] h-[70%] desktop:text-2xl lg:h-[80%]"
				/>
			</div>
		</>
	);
};
TaglineBrand.propTypes = {
	img: PropTypes.string.isRequired,
};

export default TaglineBrand;
