"use client";

import { ChevronDown, Home, Menu, ToyBrick, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { RegistryLogo } from "@/components/registry/registry-logo";
import { ModeToggle } from "@/components/registry/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getBlocks, getComponents, getUIPrimitives } from "@/lib/registry";
import Logo from "../logo";

const uiItems = getUIPrimitives();
const componentItems = getComponents();
const blockItems = getBlocks();

export const libraryItems = [
  { title: "Главная", path: "/" },
  { title: "Задания", path: "/assignments" },
  { title: "База уроков", path: "/lessons" },
  { title: "База тестов и задач", path: "/quiz" },
  { title: "Курсы", path: "/courses" },
  { title: "Медиафайлы", path: "/media" },
];

export const groupsItems = [
  { title: "Новая группа", path: "/classes/create" },
  { title: "Мои группы", path: "/classes" },
  { title: "Кабинеты", path: "/rooms" },
  { title: "Коды приглашения", path: "/invites" },
];

export function MobileSidebarTrigger() {
  const { setOpenMobile } = useSidebar();

  return (
    <div className="absolute top-8 right-4 md:hidden">
      <Button aria-label="Open menu" onClick={() => setOpenMobile(true)}>
        <Menu className="size-5" />
      </Button>
    </div>
  );
}

export function RegistrySidebar() {
  const pathname = usePathname();

  const { setOpenMobile } = useSidebar();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUiItems, setFilteredUiItems] = useState(uiItems);
  const [filteredComponents, setFilteredComponents] = useState(componentItems);
  const [filteredBlocks, setFilteredBlocks] = useState(blockItems);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUiItems(
        uiItems.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredComponents(
        componentItems.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredBlocks(
        blockItems.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUiItems(uiItems);
      setFilteredComponents(componentItems);
      setFilteredBlocks(blockItems);
    }
  }, [searchTerm]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between px-2 py-2">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Logo />
          </Link>

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setOpenMobile(false)}
          >
            <X />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full w-full pr-2">
          <Collapsible defaultOpen={true} className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between">
                  <div className="flex min-w-0 items-center">
                    <Home className="size-4 flex-shrink-0" />
                    <span className="ml-2 opacity-100 transition-all duration-200">
                      Библиотека
                    </span>
                  </div>
                  <ChevronDown className="size-4 flex-shrink-0 opacity-100 transition-all duration-200 group-data-[state=open]/collapsible:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {libraryItems.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.path}
                        >
                          <Link
                            onClick={() => setOpenMobile(false)}
                            href={item.path}
                          >
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex justify-end">
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
