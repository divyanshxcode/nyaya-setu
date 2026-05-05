import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CCMS - Court Case Monitoring System",
  description: "Government legal intelligence dashboard for tracking court judgments and converting them into verified action plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div className="flex h-screen bg-[var(--background)] font-sans">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Topbar />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
