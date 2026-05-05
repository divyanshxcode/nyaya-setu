import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:pl-60">
        <Topbar />
        <main className="p-6 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Card className="w-full max-w-md shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl font-bold mb-4">Coming Soon!</div>
              <CardDescription>To be implemented in Final round, If selected! Hopefully🤞🏻</CardDescription>
            </CardHeader>
            
          </Card>
        </main>
      </div>
    </div>
  );
}
