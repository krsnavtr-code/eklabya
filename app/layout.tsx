import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import DefaultCanonical from "./components/DefaultCanonical";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eklabya",
  description: "Eklabya - Online Learning Platform",
  icons: {
    icon: {
      rel: "icon",
      type: "image/png",
      url: "/images/eKlabya-e-fit.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-slate-50 dark:bg-slate-800 flex flex-col"
        suppressHydrationWarning
      >
        <DefaultCanonical />
        <AuthProvider>
          <AppShell>
            <main className="flex-1">{children}</main>
          </AppShell>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
