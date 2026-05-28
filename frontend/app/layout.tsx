import "./globals.css";

import ThemeProvider from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Enterprise AI Knowledge Assistant",
  description: "Enterprise AI SaaS Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" />

            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}