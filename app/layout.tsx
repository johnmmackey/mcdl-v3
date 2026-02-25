import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner'

import { SanityLive } from "@/sanity/live";

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { MyAppShell } from '@/app/ui/AppShell'
import { loggerFactory } from '@/app/lib/logger'
const logger = loggerFactory({ module: 'rootLayout' })
import { UI } from '@/app/lib/constants'

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
  const session = await auth.api.getSession({ headers: await headers() });
  logger.debug('session is', session);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, adddress=no"
        />
      </head>
      <body className={inter.className}>


        <MyAppShell session={session}>
          {children}
        </MyAppShell>

        <SanityLive />
        <Toaster richColors closeButton position='top-center' duration={UI.TOAST_DURATION_MS} />
      </body>
    </html>
  );
}

