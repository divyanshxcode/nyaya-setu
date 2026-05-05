"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Upload, 
  ClipboardCheck, 
  ListChecks, 
  Building2, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Scale,
  Clock,
  CheckCircle2,
  Book,
  User
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { section: "WORKSPACE", items: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Cases", href: "/cases", icon: Briefcase },
    { label: "Verification Queue", href: "/review", icon: ClipboardCheck, badge: 34 }
  ]},
  { section: "OPERATIONS", items: [
    { label: "Upload Judgment", href: "/upload", icon: Upload },
    { label: "Action Plans", href: "/action-plans", icon: ListChecks },
    { label: "Departments", href: "/departments", icon: Building2 }
  ]},
  { section: "REPORTING", items: [
    { label: "Appeal Deadlines", href: "/appeal-deadlines", icon: Clock },
    { label: "Compliance", href: "/compliance-tracker", icon: CheckCircle2 },
    { label: "Admin", href: "/admin", icon: BarChart3 }
  ]}
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "flex flex-col bg-[var(--surface)] border-r border-[var(--border)] h-screen transition-all duration-300 z-20",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-[var(--border)] shrink-0 overflow-hidden">
        <Scale className="w-8 h-8 text-[var(--accent-navy)] shrink-0" />
        <div className={cn(
          "ml-3 flex flex-col transition-opacity duration-200",
          collapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          <span className="font-playfair font-bold text-lg text-[var(--text-primary)] leading-tight whitespace-nowrap">CCMS</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-widest whitespace-nowrap">NYAYA SETU</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6 custom-scrollbar">
        {NAV_ITEMS.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className={cn(
              "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider pl-3 mb-1 transition-opacity",
              collapsed ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"
            )}>
              {section.section}
            </span>
            {section.items.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group",
                    active 
                      ? "bg-[var(--accent-blue-light)] text-[var(--accent-navy)] font-semibold" 
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-blue)] rounded-r-md" />}
                  <item.icon className={cn("w-5 h-5 shrink-0", active ? "text-[var(--accent-blue)]" : "")} />
                  <span className={cn(
                    "text-sm whitespace-nowrap transition-opacity",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  )}>
                    {item.label}
                  </span>
                  {item.badge && !collapsed && (
                    <span className="ml-auto bg-[var(--critical)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && collapsed && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--critical)] rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-[var(--border)] flex flex-col gap-4">
        <Link 
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors",
            pathname === "/profile" && "bg-[var(--accent-blue-light)] text-[var(--accent-navy)] font-semibold",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Profile" : undefined}
        >
          <User className="w-5 h-5 shrink-0" />
          <span className={cn("text-sm whitespace-nowrap transition-opacity", collapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
            Profile
          </span>
        </Link>
        
        <Link 
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className={cn("text-sm whitespace-nowrap transition-opacity", collapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
            Settings
          </span>
        </Link>
        
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-[var(--accent-navy)] text-white flex items-center justify-center font-bold text-sm shrink-0">
            RK
          </div>
          <div className={cn("flex flex-col transition-opacity overflow-hidden", collapsed ? "opacity-0 w-0 h-0" : "opacity-100")}>
            <span className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">Rajesh Kumar</span>
            <span className="text-xs text-[var(--text-muted)]">Reviewer</span>
          </div>
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] shadow-sm z-30"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
