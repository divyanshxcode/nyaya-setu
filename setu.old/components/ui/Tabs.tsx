"use client";

import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1 border-b border-[var(--border)]", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors relative",
              isActive 
                ? "text-[var(--text-primary)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {tab}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-navy)] rounded-t-sm animate-fade-in-up" style={{ animationDuration: '0.2s' }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
