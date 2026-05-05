"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";

export function CaseStatusChart() {
  const [period, setPeriod] = useState("This Month");
  
  // Mock data for CSS-only chart
  const data = [
    { day: "Mon", pending: 12, verified: 8, complied: 15 },
    { day: "Tue", pending: 15, verified: 12, complied: 10 },
    { day: "Wed", pending: 8, verified: 20, complied: 25 },
    { day: "Thu", pending: 22, verified: 15, complied: 18 },
    { day: "Fri", pending: 30, verified: 25, complied: 12 },
    { day: "Sat", pending: 10, verified: 5, complied: 8 },
    { day: "Sun", pending: 5, verified: 2, complied: 5 },
  ];

  const maxTotal = Math.max(...data.map(d => d.pending + d.verified + d.complied));

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <h2 className="font-semibold text-[var(--text-primary)]">Case Activity Overview</h2>
        <Tabs 
          tabs={["This Week", "This Month", "This Quarter"]} 
          activeTab={period} 
          onChange={setPeriod} 
          className="border-none"
        />
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        {/* Chart Area */}
        <div className="flex-1 flex items-end justify-between gap-2 h-[200px] mb-6">
          {data.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col justify-end items-center group relative h-full">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-[var(--text-primary)] text-white text-xs p-2 rounded shadow-lg transition-opacity z-10 whitespace-nowrap pointer-events-none">
                <div className="font-bold mb-1">{item.day}</div>
                <div>Pending: {item.pending}</div>
                <div>Verified: {item.verified}</div>
              </div>
              
              <div className="w-full max-w-[40px] flex flex-col-reverse rounded-t-sm overflow-hidden gap-[1px]">
                {/* Complied Bar */}
                <div 
                  className="w-full bg-[var(--status-verified)] transition-all duration-500 ease-out" 
                  style={{ height: `${(item.complied / maxTotal) * 100}%` }}
                />
                {/* Verified Bar */}
                <div 
                  className="w-full bg-[var(--info)] transition-all duration-500 ease-out delay-75" 
                  style={{ height: `${(item.verified / maxTotal) * 100}%` }}
                />
                {/* Pending Bar */}
                <div 
                  className="w-full bg-[var(--status-pending)] transition-all duration-500 ease-out delay-150" 
                  style={{ height: `${(item.pending / maxTotal) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-2 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--status-pending)]" />
            <span className="text-[var(--text-secondary)]">Pending Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--info)]" />
            <span className="text-[var(--text-secondary)]">Verified / Appealed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--status-verified)]" />
            <span className="text-[var(--text-secondary)]">Complied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
