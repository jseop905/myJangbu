"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/shared/lib/utils";

const tabs = [
  {
    name: "대시보드",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "수입/지출",
    href: "/ledger",
    icon: DocumentTextIcon,
  },
  {
    name: "카드/계좌",
    href: "/accounts",
    icon: CreditCardIcon,
  },
  {
    name: "구독관리",
    href: "/subscriptions",
    icon: CalendarIcon,
  },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
