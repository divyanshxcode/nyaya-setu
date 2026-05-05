'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isAutofilling, setIsAutofilling] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/dashboard');
  };

  const animateTextFill = async (
    setter: (text: string) => void,
    text: string,
    speed = 50
  ) => {
    for (let i = 0; i <= text.length; i++) {
      setter(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  };

  const handleAutofill = async () => {
    setIsAutofilling(true);
    await Promise.all([
      animateTextFill(setEmployeeId, 'user_Ai4Bharat'),
      animateTextFill(setPassword, 'demo123'),
    ]);
    setIsAutofilling(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative overflow-hidden">
        {/* Decorative Ashoka Chakra watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg viewBox="0 0 200 200" className="w-[600px] h-[600px]">
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="100" cy="100" r="15" fill="white" />
            {[...Array(24)].map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="25"
                x2="100"
                y2="10"
                stroke="white"
                strokeWidth="2"
                transform={`rotate(${i * 15} 100 100)`}
              />
            ))}
            {[...Array(24)].map((_, i) => (
              <line
                key={`spoke-${i}`}
                x1="100"
                y1="100"
                x2="100"
                y2="15"
                stroke="white"
                strokeWidth="1"
                transform={`rotate(${i * 15} 100 100)`}
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-center">
          {/* Government emblem placeholder */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 border-2 border-saffron/50 rounded-full flex items-center justify-center">
              <Scale className="h-10 w-10 text-saffron" />
            </div>
            <p className="text-white/70 text-sm tracking-wider">GOVERNMENT OF INDIA</p>
          </div>

          {/* Logo and tagline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              न्याय-Setu
            </h1>
            <p className="text-2xl text-saffron font-medium">Nyaya-Setu</p>
            <p className="text-white/80 text-lg italic">
              &quot;Bridging Justice &amp; Administration&quot;
            </p>
          </div>

          <div className="mt-12 max-w-md">
            <p className="text-white/60 text-sm leading-relaxed">
              An AI-powered judicial decision-support platform enabling efficient monitoring,
              verification, and tracking of court orders across government departments.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-navy">न्याय-सेतु</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access the Court Case Monitoring System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  placeholder="e.g., GOV-2024-001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>


              <Button
                type="submit"
                className="w-full bg-navy hover:bg-navy-light text-white"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-saffron-light rounded-lg">
              <p className="text-sm font-medium text-navy mb-1">Demo Credentials</p>
              <p className="text-xs text-navy/70 mb-3">
                Employee ID: <code className="bg-white px-1 rounded">usr_Ai4Bharat</code> |
                Password: <code className="bg-white px-1 rounded">demo123</code>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutofill}
                className="w-full"
                disabled={isAutofilling}
              >
                {isAutofilling ? 'Filling...' : 'Autofill Demo Credentials'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
