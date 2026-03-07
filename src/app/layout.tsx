import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1B5E20",
};

export const metadata: Metadata = {
  title: "Masjid Hub - Zeenat-ul-Islam",
  description: "Mobile-first Islamic community app for Zeenat-ul-Islam Masjid, Bulawayo, Zimbabwe. Prayer times, guides, duas, and community features optimized for low-bandwidth.",
  keywords: ["Masjid", "Mosque", "Prayer Times", "Islamic", "Zimbabwe", "Bulawayo", "Quran", "Duas", "Wudu", "Salah"],
  authors: [{ name: "Zeenat-ul-Islam IT Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Masjid Hub",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "Masjid Hub - Zeenat-ul-Islam",
    description: "Islamic community app with prayer times, guides, and more",
    type: "website",
    locale: "en_ZW",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
