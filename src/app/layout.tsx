import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import "@/app/globals.css";
import { Providers } from "./providers";
import ConditionalLayout from "./ConditionalLayout";

import { NextIntlClientProvider, useMessages } from "next-intl";

export const metadata: Metadata = {
  title: "Registry Starter",
  description: "Starter to help build a Shadcn Registry using Tailwind v4",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

const GeistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const MontserratSerif = Montserrat({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();

  return (
    <html
      lang={locale}
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        MontserratSerif.variable,
        "text-foreground"
      )}
    >
      <meta
        name="robots"
        content="noindex, nofollow, noarchive, nosnippet, noimageindex"
      />
      <body className="h-full">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <ConditionalLayout>{children}</ConditionalLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
