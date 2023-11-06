export function getFileNameFromUrl(url) {
	if (url === "") return "";
	// Split the URL by '/'
	const parts = url.split("/");
	// The last part will be the file name
	const fileName = parts[parts.length - 1];
	return fileName;
}
