import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

import { SanityLive } from "@/sanity/live";

import { auth, } from "@/auth"
import MyAppShell from '@/app/ui/AppShell'
import { loggerFactory } from '@/app/lib/logger'
const logger = loggerFactory({module: 'rootLayout', level: 'debug'})

import '@mantine/core/styles.css';
import "@/app/globals.css";

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
  logger.debug(session, 'session is')

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

