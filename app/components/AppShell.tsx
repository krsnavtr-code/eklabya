"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AppShellProps {
  children: React.ReactNode;
}

const HIDDEN_LAYOUT_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/forgot",
];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() ?? "";
  const hideLayout = HIDDEN_LAYOUT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
