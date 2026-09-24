import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { HashRedirect } from "@/components/HashRedirect";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anderson Vanegas — Staff SQA Engineer",
  description:
    "Portfolio of Anderson Vanegas, Staff SQA Engineer at Boston Dynamics — pytest, Appium, CI/CD, and hardware-in-the-loop testing for robotics software.",
  openGraph: {
    title: "Anderson Vanegas — Staff SQA Engineer",
    description:
      "QA engineer turned automation builder. GUI-first portfolio with an optional Linux terminal and pytest-themed test report.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <HashRedirect />
        {children}
      </body>
    </html>
  );
}
