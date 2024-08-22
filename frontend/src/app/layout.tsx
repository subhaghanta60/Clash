import type { Metadata } from "next";

import "./globals.css";
import { Inter as FontSans } from "next/font/google"
 
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"



 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})



export const metadata: Metadata = {
  title: "Classing App",
  description: "Get Your Audiance To Vote",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased bg-slate-50",
          fontSans.variable
        )}>
          <Toaster richColors position="top-right" />
          {children}
      </body>
    </html>
  );
}
