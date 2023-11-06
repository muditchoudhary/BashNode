import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

export const coverImgsAzureFunctions = () => {
	const saveImgToContainer = async (file, containerName) => {
		const AZURE_STORAGE_CONNECTION_STRING =
			process.env.AZURE_STORAGE_CONNECTION_STRING;

		// Create the BlobServiceClient object with connection string
		const blobServiceClient = BlobServiceClient.fromConnectionString(
			AZURE_STORAGE_CONNECTION_STRING
		);

		// Get a reference to a container
		const containerClient =
			blobServiceClient.getContainerClient(containerName);

		// Create a unique name for the blob
		const blobName = file.originalname;

		// Get a block blob client
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);

		await blockBlobClient.upload(file.buffer, file.size, {
			blobHTTPHeaders: {
				blobContentType: file.mimetype,
			},
		});

		return blockBlobClient.url;
	};

	const deleteImgFromContainer = async (containerName, ImgName) => {
		const AZURE_STORAGE_CONNECTION_STRING =
			process.env.AZURE_STORAGE_CONNECTION_STRING;

		// Create the BlobServiceClient object with connection string
		const blobServiceClient = BlobServiceClient.fromConnectionString(
			AZURE_STORAGE_CONNECTION_STRING
		);

		// Get a reference to a container
		const containerClient =
			blobServiceClient.getContainerClient(containerName);

		// include: Delete the base blob and all of its snapshots.
		// only: Delete only the blob's snapshots and not the blob itself.
		const options = {
			deleteSnapshots: "include",
		};

		// Create blob client from container client
		const blockBlobClient = containerClient.getBlockBlobClient(ImgName);

		await blockBlobClient.deleteIfExists(options);
	};

	const deleteAndSaveImgToContainer = async (
		file,
		containerName,
		oldImgName
	) => {
		deleteImgFromContainer(containerName, oldImgName);
		return await saveImgToContainer(file, containerName);
	};

	return {
		saveImgToContainer,
		deleteAndSaveImgToContainer,
		deleteImgFromContainer,
	};
};
