import type {Metadata} from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {Analytics} from "@vercel/analytics/react"

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
        <Header/>
        <main className={"flex-grow"}>
            {children}
            <Analytics/>
        </main>
        <Footer/>
        </body>
        </html>
    );
}
