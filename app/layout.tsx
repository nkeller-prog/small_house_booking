import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import CloudBackground from "@/components/CloudBackground";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fab House Booking",
  description: "Book a night at the Fab house.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CloudBackground />
        {children}
      </body>
    </html>
  );
}
