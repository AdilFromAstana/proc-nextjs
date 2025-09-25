"use client";

import Header from "@/components/Header/Header";
import {
  MobileSidebarTrigger,
  RegistrySidebar,
} from "@/components/registry/registry-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const ConditionalLayout = ({ children }: { children: ReactNode }) => {
  const noSidebarPages = [
    "/login",
    "/register",
    "/quiz/testing_process", // Исправил опечатку
  ];

  const pathname = usePathname();
  const showSidebar = !noSidebarPages.some(
    (page) => pathname === page || pathname.startsWith(page + "/")
  );

  return (
    <>
      <Header />
      {showSidebar ? (
        <SidebarProvider>
          <MobileSidebarTrigger />
          <RegistrySidebar />
          <main className="flex w-full justify-center h-full">{children}</main>
        </SidebarProvider>
      ) : (
        <main className="w-full">{children}</main>
      )}
      <Toaster />
    </>
  );
};

export default ConditionalLayout;
