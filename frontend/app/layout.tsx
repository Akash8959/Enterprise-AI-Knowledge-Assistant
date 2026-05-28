import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}