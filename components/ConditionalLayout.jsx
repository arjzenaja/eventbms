"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { SimpleToast } from "./ui/SimpleToast";
import { cleanupLocalStorage, getValidFlashToast } from "@/lib/utils";
import "@/lib/debug"; // Auto-cleanup on import

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const [flash, setFlash] = useState(null);

  // Clean up corrupted localStorage data
  useEffect(() => {
    if (!isAdminPage) {
      cleanupLocalStorage();
    } else {
      // If on admin page, clear any user flash toast to prevent conflicts
      try {
        localStorage.removeItem('flashToast');
      } catch (error) {
        console.warn('Could not clear user flash toast:', error);
      }
    }
  }, [isAdminPage]);

  useEffect(() => {
    // Only read user flash toast if NOT on admin page
    if (!isAdminPage) {
      const validFlash = getValidFlashToast();
      if (validFlash) {
        setFlash(validFlash);
      }
    } else {
      // Clear any existing user flash state when on admin page
      setFlash(null);
    }
  }, [isAdminPage]);
  
  return (
    <>
      {!isAdminPage && <Header />}
      {children}
      {/* Only show user notifications if NOT on admin page */}
      {!isAdminPage && flash && (
        <SimpleToast
          type={flash.type || 'success'}
          title={flash.title}
          message={flash.message}
          show={true}
          onClose={() => setFlash(null)}
          autoClose={true}
          autoCloseDelay={2000}
          position="top-right"
        />
      )}
      {!isAdminPage && <Footer />}
    </>
  );
}
