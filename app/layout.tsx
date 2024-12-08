import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const shareTechMono = localFont({
  src: "./fonts/ShareTechMono-Regular.ttf",
  variable: "--font-share-tech-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ctrl M",
  description: "Ping your bffs!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${shareTechMono.variable} font-mono antialiased relative`}
      >
        {children}
        <div className="grid" />
      </body>
    </html>
  );
}
