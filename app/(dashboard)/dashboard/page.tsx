import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { DeadlineTimeline } from '@/components/dashboard/DeadlineTimeline';
import { ComplianceChart } from '@/components/dashboard/ComplianceChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DepartmentHeatmap } from '@/components/dashboard/DepartmentHeatmap';
import { CaseStatusBadge, PriorityBadge } from '@/components/cases/CaseStatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  dashboardStats,
  complianceChartData,
  upcomingDeadlines,
  recentActivities,
  departments,
  courtCases,
} from '@/lib/mock-data';
import { FileText, ClipboardCheck, Calendar, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Filter urgent cases (overdue or high priority)
  const urgentCases = courtCases
    .filter(c => c.status === 'overdue' || (c.priority === 'high' && c.status === 'active'))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central Dashboard"
        description="The data here is simulated (due to unavailability of real data in prototype phase) This section will contain a central monitor to check all actions and summery"
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Cases"
          value={dashboardStats.totalActiveCases}
          icon={<FileText className="h-5 w-5" />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatCard
          title="Pending Human Review"
          value={dashboardStats.pendingReview}
          icon={<ClipboardCheck className="h-5 w-5" />}
          alert={dashboardStats.pendingReview > 3}
        />
        <StatCard
          title="Upcoming Deadlines (7 days)"
          value={dashboardStats.upcomingDeadlines}
          icon={<Calendar className="h-5 w-5" />}
          alert={urgentCases.some(c => c.status === 'overdue')}
        />
        <StatCard
          title="Compliance Rate"
          value={`${dashboardStats.complianceRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          progress={dashboardStats.complianceRate}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column - 60% */}
        <div className="lg:col-span-3 space-y-6">
          <DeadlineTimeline deadlines={upcomingDeadlines.slice(0, 10)} />
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Right column - 40% */}
        <div className="lg:col-span-2 space-y-6">
          <ComplianceChart data={complianceChartData} />
          <DepartmentHeatmap departments={departments} />
        </div>
      </div>

      {/* Cases requiring attention table */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Cases Requiring Immediate Attention</h3>
          <Link href="/cases">
            <Button variant="outline" size="sm">
              View All Cases
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case No.</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urgentCases.map((courtCase) => (
                <TableRow key={courtCase.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{courtCase.caseNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{courtCase.courtName}</TableCell>
                  <TableCell className="text-muted-foreground">{courtCase.department}</TableCell>
                  <TableCell>
                    <span className={courtCase.status === 'overdue' ? 'text-crimson font-medium' : ''}>
                      {courtCase.deadlineDate || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CaseStatusBadge status={courtCase.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={courtCase.priority} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/cases/${courtCase.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
