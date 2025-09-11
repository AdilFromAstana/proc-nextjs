import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import "@/app/globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  MobileSidebarTrigger,
  RegistrySidebar,
} from "@/components/registry/registry-sidebar";
import { Toaster } from "@/components/ui/sonner";

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

// Создаем Client Component для условного рендеринга
function ConditionalLayout({
  children,
  showSidebar,
}: {
  children: ReactNode;
  showSidebar: boolean;
}) {
  "use client";

  return (
    <>
      <Header />
      {showSidebar ? (
        <SidebarProvider>
          <MobileSidebarTrigger />
          <RegistrySidebar />
          <main className="flex w-full justify-center">{children}</main>
        </SidebarProvider>
      ) : (
        <main className="w-full">{children}</main>
      )}
      <Toaster />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Определяем страницы без сайдбара статически (на сервере)
  const noSidebarPages = ["/assignments", "/login", "/register"];

  // По умолчанию показываем сайдбар
  // Точное определение будет в Client Component
  const showSidebar = true;

  return (
    <html
      lang="en"
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
      <body>
        <Providers>
          <ConditionalLayout showSidebar={showSidebar}>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
