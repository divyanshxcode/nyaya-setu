'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { CaseStatusBadge, PriorityBadge } from '@/components/cases/CaseStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { courtCases, departments } from '@/lib/mock-data';
import type { CaseStatus, Priority } from '@/types';
import { Search, Upload, Eye, ClipboardCheck, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 15;

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter cases
  const filteredCases = courtCases.filter((courtCase) => {
    const matchesSearch =
      searchQuery === '' ||
      courtCase.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courtCase.petitioner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courtCase.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourt =
      courtFilter === 'all' || courtCase.courtName.includes(courtFilter);

    const matchesDepartment =
      departmentFilter === 'all' ||
      courtCase.department.toLowerCase().includes(departmentFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || courtCase.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || courtCase.priority === priorityFilter;

    return matchesSearch && matchesCourt && matchesDepartment && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getDeadlineDisplay = (deadline?: string, status?: CaseStatus) => {
    if (!deadline) return 'N/A';
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (status === 'overdue' || diffDays < 0) {
      return (
        <span className="text-crimson font-medium">
          {Math.abs(diffDays)} days overdue
        </span>
      );
    } else if (diffDays <= 7) {
      return (
        <span className="text-amber font-medium">
          {diffDays} days
        </span>
      );
    }
    return deadline;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Cases"
        description={`${courtCases.length} total cases in the system`}
      >
        <Link href="/upload">
          <Button className="bg-navy hover:bg-navy-light">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Judgment
          </Button>
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search case number, petitioner, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={courtFilter} onValueChange={setCourtFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Court" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              <SelectItem value="Delhi">Delhi High Court</SelectItem>
              <SelectItem value="Bombay">Bombay High Court</SelectItem>
              <SelectItem value="Madras">Madras High Court</SelectItem>
              <SelectItem value="Supreme">Supreme Court</SelectItem>
              <SelectItem value="Punjab">Punjab & Haryana HC</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.shortCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="complied">Complied</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="appeal">Appeal</SelectItem>
              <SelectItem value="disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Case No.</TableHead>
                <TableHead>Court</TableHead>
                <TableHead className="hidden lg:table-cell">Petitioner vs Respondent</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="hidden md:table-cell">Date of Order</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Review</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCases.map((courtCase) => (
                <TableRow
                  key={courtCase.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <TableCell className="font-medium">
                    <Link href={`/cases/${courtCase.id}`} className="hover:text-saffron">
                      {courtCase.caseNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {courtCase.courtName.replace(' High Court', ' HC').replace('Supreme Court of India', 'SC')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                    {courtCase.petitioner} vs {courtCase.respondent}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-1 bg-muted rounded">
                      {departments.find(d => d.name === courtCase.department)?.shortCode || courtCase.department.slice(0, 3).toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {courtCase.dateOfOrder}
                  </TableCell>
                  <TableCell>
                    {getDeadlineDisplay(courtCase.deadlineDate, courtCase.status)}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={courtCase.priority} />
                  </TableCell>
                  <TableCell>
                    <CaseStatusBadge status={courtCase.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded',
                        courtCase.reviewStatus === 'approved'
                          ? 'bg-jade-light text-jade'
                          : courtCase.reviewStatus === 'pending_review'
                          ? 'bg-saffron-light text-amber'
                          : courtCase.reviewStatus === 'rejected'
                          ? 'bg-crimson-light text-crimson'
                          : 'bg-blue-50 text-blue-700'
                      )}
                    >
                      {courtCase.reviewStatus.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/cases/${courtCase.id}`}>
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {courtCase.reviewStatus === 'pending_review' && (
                        <Link href={`/review/${courtCase.id}`}>
                          <Button variant="ghost" size="icon" title="Review">
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button variant="ghost" size="icon" title="Download PDF">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredCases.length)} of{' '}
            {filteredCases.length} cases
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
