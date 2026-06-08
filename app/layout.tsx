import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { LanguageProvider as KimanceLanguageProvider } from "@/app/providers/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kimance - Global Dashboard",
  description: "Your financial overview dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <LanguageProvider>
          <KimanceLanguageProvider>
            {children}
          </KimanceLanguageProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
