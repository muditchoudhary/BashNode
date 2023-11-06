export const fileValidation = () => {
	const validateCoverImg = (req, file, cb) => {
		const allowedExtensions = ["image/jpg", "image/jpeg", "image/png"];

		if (allowedExtensions.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Invalid file type. Only jpg, jpeg and png image files are allowed."
				),
				false
			);
		}
	};

	return { validateCoverImg };
};
