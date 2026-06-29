import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parla — Learn Italian",
  description: "Duolingo-style Italian language learning platform with spaced repetition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" className={`${baloo2.variable} ${nunito.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-background">{children}</body>
      </html>
    </AuthProvider>
  );
}
