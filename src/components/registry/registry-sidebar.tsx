"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

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
import Logo from "../logo";
import { GroupsIcon } from "./icons/GroupsIcon";
import { LibraryIcon } from "./icons/LibraryIcon";
import { InfoIcon } from "./icons/InfoIcon";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function MobileSidebarTrigger() {
  const { setOpenMobile } = useSidebar();

  return (
    <div className="absolute top-8 right-4 md:hidden">
      <Button
        aria-label="Open menu"
        onClick={() => setOpenMobile(true)}
        variant="ghost"
        size="icon"
      >
        <Menu className="size-5" />
      </Button>
    </div>
  );
}

export function RegistrySidebar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  // Мемоизированные данные для навигации
  const libraryItems = useMemo(
    () => [
      { title: t("page-main-page"), path: "/" },
      { title: t("page-assignment-index"), path: "/assignments" },
      { title: t("page-lesson-index"), path: "/lessons" },
      { title: t("page-quiz-index"), path: "/quiz" },
      { title: t("page-course-index"), path: "/courses" },
      { title: t("page-media-index"), path: "/media" },
    ],
    [t]
  );

  const groupsItems = useMemo(
    () => [
      { title: t("page-class-create"), path: "/classes/create" },
      { title: t("page-class-index"), path: "/classes" },
      { title: t("page-rooms-index"), path: "/rooms" },
      { title: t("page-invite-index"), path: "/invites" },
    ],
    [t]
  );

  // Функция для получения следующей локали
  const getNextLocale = useCallback((current: string) => {
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
  }, []);

  // Функция для получения метки языка
  const getLanguageLabel = useCallback((locale: string) => {
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
  }, []);

  // Смена языка без перезагрузки страницы
  const switchLanguage = useCallback(() => {
    const newLocale = getNextLocale(locale);

    // Обновляем куки
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    router.refresh();
  }, [locale, pathname, getNextLocale, router]);

  // Компонент для пунктов навигации
  const NavItem = useCallback(
    ({ item }: { item: { title: string; path: string } }) => (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton asChild isActive={pathname === item.path}>
          <Link
            onClick={() => setOpenMobile(false)}
            href={item.path}
            className="transition-colors hover:text-primary"
          >
            {item.title}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ),
    [pathname, setOpenMobile]
  );

  // Компонент для секций сайдбара
  const SidebarSection = useCallback(
    ({
      defaultOpen = true,
      icon: Icon,
      label,
      items,
    }: {
      defaultOpen?: boolean;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      items: Array<{ title: string; path: string }>;
    }) => (
      <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
        <SidebarGroup>
          <CollapsibleTrigger className="w-full">
            <SidebarGroupLabel className="flex cursor-pointer items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="flex min-w-0 items-center">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="ml-2 opacity-100 transition-all duration-200 text-sm font-medium">
                  {label}
                </span>
              </div>
              <ChevronDown className="size-4 flex-shrink-0 opacity-70 transition-all duration-200 group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    ),
    [NavItem]
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <Link
            href="/"
            className="flex min-w-0 items-center hover:opacity-80 transition-opacity"
            onClick={() => setOpenMobile(false)}
          >
            <Logo />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpenMobile(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full w-full pr-2">
          <div className="space-y-1">
            <SidebarSection
              icon={LibraryIcon}
              label={t("label-library")}
              items={libraryItems}
            />

            <SidebarSection
              icon={GroupsIcon}
              label={t("label-group-list")}
              items={groupsItems}
            />

            <SidebarSection
              icon={InfoIcon}
              label={t("label-resources")}
              items={[
                { title: t("label-digital-library"), path: "/resources" },
              ]}
            />
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex justify-between items-center w-full p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={switchLanguage}
            className="flex items-center gap-2 hover:bg-accent/50 transition-colors"
            title={t("label-import-class-group-language") || "Switch language"}
          >
            <span className="text-sm font-medium">
              {getLanguageLabel(locale)}
            </span>
          </Button>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
