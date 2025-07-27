'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-white ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}