import { useState } from "react";

export const useBlogs = () => {
	const [blogs, setBlogs] = useState(null);
	const [isLoading, setIsLoading] = useState(null);

	const setBlogsInitially = (blogs) => {
		setBlogs(blogs);
	};

	const startLoading = () => {
		setIsLoading(true);
	};
	const stopLoading = () => {
		setIsLoading(false);
	};

	return { blogs, isLoading, setBlogsInitially, startLoading, stopLoading };
};
