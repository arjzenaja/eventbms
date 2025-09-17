"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { NotificationProvider } from "./NotificationProvider";
import { cleanupLocalStorage } from "@/lib/utils";
import "@/lib/debug"; // Auto-cleanup on import

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

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
  
  return (
    <>
      {!isAdminPage && <Header />}
      {/* Wrap page content with NotificationProvider so hooks work inside */}
      {!isAdminPage ? (
        <NotificationProvider>
          {children}
        </NotificationProvider>
      ) : (
        children
      )}
      {!isAdminPage && <Footer />}
    </>
  );
}
