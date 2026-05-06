'use client';

import { Bell, Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/upload': 'Upload Judgment',
  '/cases': 'All Cases',
  '/review': 'Review Queue',
  '/actions': 'Action Plans',
  '/departments': 'Departments',
  '/appeals': 'Appeals',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export function Topbar() {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];
    
    let currentPath = '';
    for (const path of paths) {
      currentPath += `/${path}`;
      const label = routeLabels[currentPath] || path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ label, href: currentPath });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases..."
              className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-saffron"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-crimson text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">Deadline Alert</span>
                <span className="text-xs text-muted-foreground">
                  CWP-1892-2023 is overdue by 15 days
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">Review Pending</span>
                <span className="text-xs text-muted-foreground">
                  4 cases awaiting human verification
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">New Upload</span>
                <span className="text-xs text-muted-foreground">
                  W.P.(C) 7823/2024 processed successfully
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-saffron">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-xs font-semibold text-white">
                  AS
                </div>
                <span className="hidden md:inline text-sm font-medium">ai4bharat_user</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
