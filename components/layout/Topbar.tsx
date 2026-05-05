"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Calendar, ChevronRight } from "lucide-react";

export function Topbar() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6 sticky top-0 z-10 w-full shrink-0">
      
      {/* Breadcrumb / Left */}
      <div className="flex items-center text-sm">
        <span className="text-[var(--text-muted)]">CCMS</span>
        {pathSegments.map((segment, index) => (
          <div key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-[var(--text-muted)]" />
            <span className={index === pathSegments.length - 1 ? "text-[var(--text-primary)] font-medium capitalize" : "text-[var(--text-muted)] capitalize"}>
              {segment.replace(/-/g, ' ')}
            </span>
          </div>
        ))}
      </div>

      {/* Global Search / Center */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-blue)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search cases, judgments, departments..." 
            className="w-full bg-[var(--surface-raised)] border border-transparent rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block font-mono text-[10px] text-[var(--text-muted)] bg-[var(--border)] px-1.5 py-0.5 rounded border border-[var(--border-strong)]">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Calendar className="w-4 h-4" />
          <span>{today}</span>
        </div>
        
        <div className="w-px h-6 bg-[var(--border)] hidden md:block"></div>
        
        <button className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--critical)] rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-[var(--surface)]">
            3
          </span>
        </button>
      </div>

    </header>
  );
}
