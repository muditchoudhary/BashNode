import { useState } from "react";

export const useSideDrawerManagement = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  };
};
