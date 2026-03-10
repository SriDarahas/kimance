"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

interface NavItem {
  href: string;
  icon: string;
  labelKey: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: "dashboard", labelKey: "dashboard" },
  { href: "/wallets", icon: "account_balance_wallet", labelKey: "myWallets" },
  { href: "/send-money", icon: "send", labelKey: "sendMoney" },
  { href: "/marketplace", icon: "storefront", labelKey: "marketplace" },
  { href: "/find-tax-experts", icon: "person_search", labelKey: "findTaxExperts" },
  { href: "/settings", icon: "settings", labelKey: "settings" },
];

const adminNavItem: NavItem = {
  href: "/admin",
  icon: "admin_panel_settings",
  labelKey: "admin",
};

export default function SidebarNavigation({
  onNavigate,
  isAdmin = false,
}: {
  onNavigate?: () => void;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const items = isAdmin ? [...navItems, adminNavItem] : navItems;

  return (
    <nav className="flex-1 px-4 space-y-1 mt-2">
      {items.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard" || pathname === "/"
            : pathname.startsWith(item.href) && item.href !== "#";
        return (
          <Link
            key={item.labelKey}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              isActive
                ? "bg-purple-600/10 text-purple-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <span className="material-icons-outlined text-xl">{item.icon}</span>
            {item.labelKey === "admin"
              ? "Admin"
              : getTranslation(language, item.labelKey as any)}
            {item.badge && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
