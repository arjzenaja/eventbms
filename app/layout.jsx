import { Poppins, Caveat } from "next/font/google";
import "./globals.css";

// contexts
import { EventProvider } from "@/context/EventContext";
import { TicketProvider } from "@/context/TicketContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CulinaryCartProvider } from "@/context/CulinaryCartContext";

import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata = {
  title: "EventBMS - Tourism Management System",
  description: "Sistem manajemen wisata Kabupaten Banyumas",
  icons: {
    icon: "/Lambang_Kabupaten_Banyumas.png"
  }
};

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const caveat = Caveat({
  weight: ["400", "500", "600", "700",],
  subsets: ["latin"],
  variable: "--font-caveat",
});

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <EventProvider>
        <TicketProvider>
          <ThemeProvider>
            <CulinaryCartProvider>
              <html lang="en">
                <body
                  className={`${poppins.variable} ${caveat.variable} antialiased bg-white text-slate-900 dark:bg-gray-900 dark:text-white`}
                >
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                </body>
              </html>
            </CulinaryCartProvider>
          </ThemeProvider>
        </TicketProvider>
      </EventProvider>
    </UserProvider>
  );
}
