import { useState } from "react";

export const useBlogsManagement = () => {
  const [blogsData, setBlogsData] = useState(null);
  const [isBlogLoading, setIsBlogLoading] = useState(false);

  const setInitialBlogsData = (blogs) => {
    setBlogsData(blogs);
  };

  const startLoading = () => {
    setIsBlogLoading(true);
  };

  const stopLoading = () => {
    setIsBlogLoading(false);
  };

  return {
    blogsData,
    isBlogLoading,
    setInitialBlogsData,
    startLoading,
    stopLoading,
  };
};
