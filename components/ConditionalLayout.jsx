"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Toast } from "./ui/alert";
import { SimpleToast } from "./ui/SimpleToast";
import { cleanupLocalStorage, getValidFlashToast } from "@/lib/utils";
import "@/lib/debug"; // Auto-cleanup on import

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const [flash, setFlash] = useState(null);

  // Clean up corrupted localStorage data
  useEffect(() => {
    cleanupLocalStorage();
  }, []);

  useEffect(() => {
    // Read flash toast immediately
    const validFlash = getValidFlashToast();
    if (validFlash) {
      setFlash(validFlash);
    }
  }, []);
  
  return (
    <>
      {!isAdminPage && <Header />}
      {children}
                    {flash && (
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
