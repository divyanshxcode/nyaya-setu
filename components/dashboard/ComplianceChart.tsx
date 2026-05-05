'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ComplianceChartProps {
  data: ChartData[];
  className?: string;
}

export function ComplianceChart({ data, className }: ComplianceChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className={cn('bg-card rounded-xl p-6 shadow-sm border border-border', className)}>
      <h3 className="font-semibold text-lg mb-4">Case Status Distribution</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ChartData;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.value} cases ({((item.value / total) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {payload?.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs text-muted-foreground">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Stats summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <span className="text-3xl font-bold">{total}</span>
          <p className="text-sm text-muted-foreground">Total Cases</p>
        </div>
      </div>
    </div>
  );
}
