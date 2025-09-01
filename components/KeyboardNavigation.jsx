"use client";

import { useEffect } from "react";

const KeyboardNavigation = ({ onBack, onRetry }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Escape key untuk kembali
      if (event.key === "Escape") {
        event.preventDefault();
        onBack?.();
      }

      // Ctrl/Cmd + R untuk refresh/retry
      if ((event.ctrlKey || event.metaKey) && event.key === "r") {
        event.preventDefault();
        onRetry?.();
      }

      // F5 untuk refresh
      if (event.key === "F5") {
        event.preventDefault();
        onRetry?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBack, onRetry]);

  return null;
};

export default KeyboardNavigation;
