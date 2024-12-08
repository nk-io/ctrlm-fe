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
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="shortcut icon" href="/favicon.ico" />
      <body
        className={`${shareTechMono.variable} font-mono antialiased relative overflow-hidden`}
      >
        {children}
        <div className="grid" />
      </body>
    </html>
  );
}
