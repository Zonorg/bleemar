import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";

const roboto = Roboto_Condensed({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bleemar",
  description: "Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${roboto.className} flex h-full`}>
        <SessionProvider session={session}>
          <Sidebar />
          <div className="children h-full w-5/6 max-md:w-full flex flex-col justify-between m-auto py-6">
            <Header />
            {children}
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
