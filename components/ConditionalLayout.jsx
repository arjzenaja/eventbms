"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Toast } from "./ui/alert";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flashToast');
      if (raw) {
        const parsed = JSON.parse(raw);
        setFlash(parsed);
        localStorage.removeItem('flashToast');
      }
    } catch (_) {}
  }, []);
  
  return (
    <>
      {!isAdminPage && <Header />}
      {children}
      {flash && (
        <Toast
          type={flash.type || 'success'}
          title={flash.title}
          message={flash.message}
          show={true}
          onClose={() => setFlash(null)}
          autoClose={true}
          autoCloseDelay={4000}
          position="top-right"
        />
      )}
      {!isAdminPage && <Footer />}
    </>
  );
}
