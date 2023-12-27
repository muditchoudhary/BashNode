import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Button } from "antd";

import { ReactComponent as AddCoverIcon } from "../../../assets/icons/gallery.svg";

const fileTypes = ["image/jpg", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_SIZE_MB = 10;

export const ActionBar = ({
	coverImg,
	setCoverImg,
	isBlogActionLoading,
	setIsCoverImgNull,
}) => {
	const validFileType = (file) => fileTypes.includes(file.type);
	const validFileSize = (file) => file.size <= MAX_FILE_SIZE;

	const updateImageDisplay = (e) => {
		const curFiles = e.target.files;

		const imgFile = curFiles[0];

		if (validFileType(imgFile)) {
			if (!validFileSize(imgFile)) {
				setCoverImg(null);
                setIsCoverImgNull(true);
				toast.error(
					`File size is too big. Please upload a file less than equal to ${MAX_FILE_SIZE_MB} MB.`
				);
				return;
			}

			setCoverImg(imgFile);
			setIsCoverImgNull(false);
		} else {
			setCoverImg(null);
			setIsCoverImgNull(true);
			toast.error(
				"File type not supported. Please upload a .jpg, .jpeg, or .png file."
			);
		}
	};

	return (
		<div>
			<div className="py-2">
				{coverImg !== null && coverImg !== "" ? (
					<Button
						type="primary"
						shape="round"
						danger
						onClick={() => {
							setCoverImg(null);
							setIsCoverImgNull(true);
						}}
						disabled={isBlogActionLoading}
					>
						Remove Cover
					</Button>
				) : (
					<>
						<label
							htmlFor="cover-img"
							className="flex items-center gap-3 w-fit hover:bg-[#0000000f] text-base rounded-3xl cursor-pointer"
							disabled={isBlogActionLoading}
						>
							<AddCoverIcon className="w-[18px] h-auto" /> Add
							Cover
						</label>
						<input
							type="file"
							id="cover-img"
							name="cover-img"
							accept=".jpg, .jpeg, .png"
							className="w-0 opacity-0"
							onChange={updateImageDisplay}
							disabled={isBlogActionLoading}
						/>
					</>
				)}
			</div>

			<div className="cover-img-preview">
				{coverImg !== null && coverImg !== "" && (
					<img
						src={
							typeof coverImg === "object"
								? URL.createObjectURL(coverImg)
								: coverImg
						}
						className="w-full h-full object-cover lg:h-[60vh] lg:object-cover"
						alt="Cover Preview"
					/>
				)}
			</div>
		</div>
	);
};

ActionBar.propTypes = {
	coverImg: PropTypes.any,
	setCoverImg: PropTypes.func.isRequired,
	isBlogActionLoading: PropTypes.bool.isRequired,
	setIsCoverImgNull: PropTypes.func.isRequired,
};
