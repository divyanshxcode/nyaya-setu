import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <div className="text-6xl font-bold text-saffron mb-4">404</div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>Coming soon - to be implemented in final round</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            The page you're looking for is not available yet. We're working on bringing this
            feature to you soon.
          </p>
          <Link href="/dashboard">
            <Button className="w-full bg-navy hover:bg-navy-light text-white">
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
