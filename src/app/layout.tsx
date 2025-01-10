import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReportFlow Jobs",
  description: "A job builder for the app ReportFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`min-h-screen flex flex-col`}>    
    <main className={"flex-grow"}>
        {children}
    </main>
    </body>
    </html>
  );
}
