import type { Metadata } from "next";
import { MyNavbar } from "@/app/ui/MyNavbar";
import { SideNav } from '@/app/ui/SideNav'
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MCDL",
  description: "MCDL Dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-screen-lg mx-auto p-2">
          <MyNavbar />
          <div className="mt-8 flex">
            {/*<SideNav />*/}
            <div className="grow">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
