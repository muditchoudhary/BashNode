import { toast } from "react-toastify";

import { ReactComponent as AddCoverIcon } from "../../../assets/icons/gallery.svg";

const fileTypes = ["image/jpg", "image/jpeg", "image/png"];

export const ActionBar = () => {
	function validFileType(file) {
		return fileTypes.includes(file.type);
	}
	function validFileSize(file) {
		return file.size <= 5 * 1024 * 1024;
	}
	const updateImageDisplay = (e) => {
		const preview = document.querySelector(".cover-img-preview");
		const curFiles = e.target.files;
		if (curFiles.length === 1) {
			while (preview.firstChild) {
				preview.removeChild(preview.firstChild);
			}
			const imgFile = curFiles[0];
			if (validFileType(imgFile)) {
				if (!validFileSize(imgFile)) {
					toast.error(
						"File size is too big. Please upload a file less than 5MB."
					);
					return;
				}
				const imageContainer = document.createElement("div");
				imageContainer.className = "w-full h-48";
				const image = document.createElement("img");
				image.className = "w-full h-full object-cover";
				image.src = URL.createObjectURL(imgFile);
				imageContainer.appendChild(image);
				preview.appendChild(imageContainer);
			} else {
				toast.error(
					"File not supported. Please upload a .jpg, .jpeg or .png file."
				);
			}
		}
	};
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
				className=" w-0 opacity-0"
				onChange={updateImageDisplay}
			/>
			<div className="cover-img-preview border-2 border-red-700 border-solid"></div>
		</div>
	);
};
