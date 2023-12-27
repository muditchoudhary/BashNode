import multer from "multer";

export const handleFileUpload = (req, res, next, upload, imgName) => {
    upload.single(imgName)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res
                .status(SERVER_RESPONSES.BAD_REQUEST)
                .json({ success: false, message: err.message });
        } else if (err) {
            // If the error is not an instance of multer.MulterError, it must be an error thrown by the validator.
            // If the err.message is undefined, it means that the error was from Internal server.
            // else the error was from the validator
            return err.message
                ? res.status(SERVER_RESPONSES.BAD_REQUEST).json({
                        success: false,
                        message: err.message,
                  })
                : res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Internal server error.",
                  });
        }

        next();
    });
};