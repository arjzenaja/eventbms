import { Poppins, Caveat } from "next/font/google";
import "./globals.css";

// contexts
import EventProvider from "@/context/EventContext";
import TicketProvider from "@/context/TicketContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";

import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata = {
  title: "EventBMS - Tourism Management System",
  description: "Sistem manajemen wisata Kabupaten Banyumas",
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
            <html lang="en">
              <body
                className={`${poppins.variable} ${caveat.variable} antialiased`}
              >
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </body>
            </html>
          </ThemeProvider>
        </TicketProvider>
      </EventProvider>
    </UserProvider>
  );
}
