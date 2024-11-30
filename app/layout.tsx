import type { Metadata } from "next";
import { MyNavbar } from "@/app/ui/MyNavbar";
import { SideNav } from '@/app/ui/SideNav';
import { Inter } from "next/font/google";
import { auth } from "@/auth"
import "@/app/globals.css";
import { fetchCurrentSeason } from "./lib/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MCDL",
  description: "MCDL Dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const currentSeason = await fetchCurrentSeason();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-screen-lg mx-auto">
          <MyNavbar session={session} currentSeasonId={currentSeason.id} />
          <div className="mx-2 flex">
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
