'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  FileText,
  ClipboardCheck,
  ListTodo,
  Building2,
  Scale,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navigationGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Case Management',
    items: [
      { name: 'Upload Judgment', href: '/upload', icon: Upload },
      { name: 'All Cases', href: '/cases', icon: FileText },
      { name: 'Review Queue', href: '/review', icon: ClipboardCheck },
      { name: 'Action Plans', href: '/actions', icon: ListTodo },
    ],
  },
  {
    label: 'Tracking',
    items: [
      { name: 'Departments', href: '/departments', icon: Building2 },
      { name: 'Appeals', href: '/appeals', icon: Scale },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-navy text-white rounded-lg"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-navy/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-60 bg-navy text-white flex flex-col z-50 transition-transform duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-navy-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-saffron rounded-lg flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                न्याय-सेतु
              </h1>
              <p className="text-xs text-white/70">Court Case Monitoring</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navigationGroups.map((group) => (
            <div key={group.label} className="mb-6">
              <h2 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                {group.label}
              </h2>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                          isActive
                            ? 'bg-navy-light text-white border-l-3 border-saffron ml-0 pl-2.5'
                            : 'text-white/70 hover:text-white hover:bg-navy-light/50'
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-navy-light">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center text-sm font-semibold">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Dr. Amit Sharma</p>
              <p className="text-xs text-white/60 truncate">Admin</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-navy-light/50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  );
}
