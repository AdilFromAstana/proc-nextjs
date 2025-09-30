"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
import { GroupsIcon } from "./icons/GroupsIcon";
import { LibraryIcon } from "./icons/LibraryIcon";
import { InfoIcon } from "./icons/InfoIcon";

const uiItems = getUIPrimitives();
const componentItems = getComponents();
const blockItems = getBlocks();

import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUiItems, setFilteredUiItems] = useState(uiItems);
  const [filteredComponents, setFilteredComponents] = useState(componentItems);
  const [filteredBlocks, setFilteredBlocks] = useState(blockItems);

  const libraryItems = [
    { title: t("page-main-page"), path: "/" },
    { title: t("page-assignment-index"), path: "/assignments" },
    { title: t("page-lesson-index"), path: "/lessons" },
    { title: t("page-quiz-index"), path: "/quiz" },
    { title: t("page-course-index"), path: "/courses" },
    { title: t("page-media-index"), path: "/media" },
  ];

  const groupsItems = [
    { title: t("page-class-create"), path: "/classes/create" },
    { title: t("page-class-index"), path: "/classes" },
    { title: t("page-rooms-index"), path: "/rooms" },
    { title: t("page-invite-index"), path: "/invites" },
  ];

  const switchLanguage = () => {
    const currentLocale =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("locale="))
        ?.split("=")[1] || "ru";

    // Определяем следующий язык по кругу: ru -> en -> kz -> ru
    const getNextLocale = (current: string) => {
      switch (current) {
        case "ru":
          return "en";
        case "en":
          return "kz";
        case "kz":
          return "ru";
        default:
          return "ru";
      }
    };

    const newLocale = getNextLocale(currentLocale);

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Перезагружаем страницу для применения нового языка
    window.location.reload();
  };

  const getCurrentLanguage = () => {
    if (typeof document === "undefined") return "ru";

    const locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];

    return locale || "ru";
  };

  const getLanguageLabel = (locale: string) => {
    switch (locale) {
      case "kz":
        return "ҚАЗ";
      case "ru":
        return "РУС";
      case "en":
        return "ENG";
      default:
        return "РУС";
    }
  };

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
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <Link href="/" className="flex min-w-0 items-center">
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
                    <LibraryIcon className="w-5 h-5" />
                    <span className="ml-2 opacity-100 transition-all duration-200">
                      {t("label-library")}
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

          <Collapsible defaultOpen={true} className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between">
                  <div className="flex min-w-0 items-center">
                    <GroupsIcon className="w-5 h-5" />
                    <span className="ml-2 opacity-100 transition-all duration-200">
                      {t("label-group-list")}
                    </span>
                  </div>
                  <ChevronDown className="size-4 flex-shrink-0 opacity-100 transition-all duration-200 group-data-[state=open]/collapsible:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {groupsItems.map((item) => (
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

          <Collapsible defaultOpen={true} className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between">
                  <div className="flex min-w-0 items-center">
                    <InfoIcon className="w-5 h-5" />
                    <span className="ml-2 opacity-100 transition-all duration-200">
                      {t("label-resources")}
                    </span>
                  </div>
                  <ChevronDown className="size-4 flex-shrink-0 opacity-100 transition-all duration-200 group-data-[state=open]/collapsible:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem key={"/resources"}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === "/resources"}
                      >
                        <Link
                          onClick={() => setOpenMobile(false)}
                          href={"/resources"}
                        >
                          {t("label-digital-library")}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex justify-between items-center w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={switchLanguage}
            className="flex items-center gap-2"
          >
            <span>{getLanguageLabel(getCurrentLanguage())}</span>
          </Button>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
