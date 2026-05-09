import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ghopay-sigma.vercel.app"),
  title: "Ghopay | Cloak SDK",
  description: "Private batch payroll via Cloak SDK",
};

import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";
import { TechStack } from "@/components/TechStack";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <StatusBar />
        <div className="grow">
          {children}
        </div>
        <TechStack />
        <Footer />
      </body>
    </html>
  );
}
