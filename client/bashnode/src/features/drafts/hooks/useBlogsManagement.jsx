import { useState } from "react";

export const useBlogsManagement = () => {
  const [blogsData, setBlogsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const setInitialBlogsData = (blogs) => {
    setBlogsData(blogs);
  };

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return {
    blogsData,
    isLoading,
    setInitialBlogsData,
    startLoading,
    stopLoading,
  };
};
