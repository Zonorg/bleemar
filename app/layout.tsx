import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import Sidebar from "./components/sidebar";
import "./globals.css";
import Footer from "./components/footer";
// import Header from "./components/Header";
import SessionProvider from "./components/session-provider";
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
      <SessionProvider session={session}>
        <body className={`${roboto.className} flex h-full`}>
          <Sidebar />
          <div className="children w-5/6 h-full max-lg:h-auto max-lg:w-full flex flex-col justify-between m-auto py-5 max-lg:pb-20">
            {/* <Header /> */}
            {children}
          </div>
          <Footer />
        </body>
      </SessionProvider>
    </html>
  );
}
