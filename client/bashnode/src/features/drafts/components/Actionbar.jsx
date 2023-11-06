import { toast } from "react-toastify";
import PropTypes, { object } from "prop-types";

import { ReactComponent as AddCoverIcon } from "../../../assets/icons/gallery.svg";

const fileTypes = ["image/jpg", "image/jpeg", "image/png"];

export const ActionBar = ({ coverImg, setCoverImg }) => {
	function validFileType(file) {
		return fileTypes.includes(file.type);
	}
	function validFileSize(file) {
		return file.size <= 10 * 1024 * 1024;
	}
	const updateImageDisplay = (e) => {
		const preview = document.querySelector(".cover-img-preview");
		console.log(preview);
		const curFiles = e.target.files;
		console.log(curFiles[0]);
		if (curFiles.length === 1) {
			while (preview.firstChild) {
				preview.removeChild(preview.firstChild);
			}
			const imgFile = curFiles[0];
			if (validFileType(imgFile)) {
				if (!validFileSize(imgFile)) {
					setCoverImg(null);
					toast.error(
						"File size is too big. Please upload a file less than equal to 10MB."
					);
					return;
				}
				// const imageContainer = document.createElement("div");
				// imageContainer.className = "w-full h-48";
				// const image = document.createElement("img");
				// image.className = "w-full h-full object-cover";
				// image.src = URL.createObjectURL(imgFile);
				// imageContainer.appendChild(image);
				// preview.appendChild(imageContainer);
				setCoverImg(imgFile);
			} else {
				setCoverImg(null);
				toast.error(
					"File type not supported. Please upload a .jpg, .jpeg or .png file."
				);
			}
		}
	};
	console.log("Cover Img", coverImg);
	console.log("Is cover Img not null", coverImg !== null);
	console.log("Type of cover Img", typeof coverImg);
	console.log("cover is img is object or not", typeof coverImg === "object");
	console.log(typeof coverImg === "object" ? URL.createObjectURL(coverImg) : coverImg);
	return (
		<div className="editor-action-bar border-2 border-solid border-yellow-500">
			<label
				htmlFor="cover-img"
				className=" flex items-center gap-4 w-fit hover:bg-[#0000000f] text-2xl py-2 px-4 rounded-3xl cursor-pointer "
			>
				<AddCoverIcon className="w-6 h-auto" /> Add Cover
			</label>
			<input
				type="file"
				id="cover-img"
				name="cover-img"
				accept=".jpg, .jpeg, .png"
				className=" w-0 opacity-0"
				onChange={updateImageDisplay}
			/>

			<div className="cover-img-preview border-2 border-red-700 border-solid">
				{coverImg !== null && coverImg !== "" && (
					<img
						src={
							typeof coverImg === "object"
								? URL.createObjectURL(coverImg)
								: coverImg
						}
						className="w-full h-full object-cover"
					/>
				)}
			</div>
		</div>
	);
};
ActionBar.propTypes = {
	coverImg: PropTypes.object,
	setCoverImg: PropTypes.func.isRequired,
};
