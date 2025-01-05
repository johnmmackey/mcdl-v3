import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/auth"
import "@/app/globals.css";
import { fetchCurrentSeason } from "./lib/data";
import MyAppShell from '@/app/ui/AppShell'

import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

import { SanityLive } from "@/sanity/live";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, adddress=no"
        />
      </head>
      <body className={inter.className}>
        <MantineProvider>
          
          <MyAppShell session={session}>
            {children}
          </MyAppShell>
        </MantineProvider>
        <SanityLive />
      </body>
    </html>
  );
}

/*
          <div className="max-w-screen-lg mx-auto">
            <HeaderMenu session={session} currentSeasonId={currentSeason.id} />
            <div className="mx-2 flex">
              <div className="grow">
                {children}
              </div>
            </div>
          </div>
          */