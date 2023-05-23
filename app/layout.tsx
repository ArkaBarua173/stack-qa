import { NextAuthProvider } from "@/components/Provider";
import "./globals.css";
import "react-quill/dist/quill.snow.css";
import "./react-quill.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import QueryWrapper from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stack-QA | Home",
  description: "created by Arka Barua",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className && "bg-slate-100"}>
        <NextAuthProvider>
          <QueryWrapper>
            <Navbar />
            {children}
          </QueryWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
