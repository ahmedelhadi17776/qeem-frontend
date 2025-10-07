import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
  maxValue?: number;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function BarChart({ data, title, height = 300, showValues = true, className = '' }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 ${className}`}
      >
        <p className="text-text-muted dark:text-slate-400 text-center">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.maxValue ?? item.value));

  return (
    <div
      className={`bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 ${className}`}
    >
      {title && <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-6">{title}</h3>}

      <div className="space-y-4" style={{ height: `${height}px` }}>
        {data.map(item => {
          const percentage = (item.value / maxValue) * 100;
          const barWidth = (percentage / 100) * 100;

          return (
            <div key={item.label} className="flex items-center space-x-4">
              <div className="w-24 flex-shrink-0">
                <p className="text-sm text-text-main dark:text-slate-100 truncate" title={item.label}>
                  {item.label}
                </p>
              </div>

              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ease-out ${item.color ?? 'bg-accent'}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {showValues && (
                  <div className="absolute -top-6 right-0">
                    <span className="text-xs text-text-muted dark:text-slate-400">{item.value}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface HorizontalBarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function HorizontalBarChart({ data, title, showValues = true, className = '' }: HorizontalBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 ${className}`}
      >
        <p className="text-text-muted dark:text-slate-400 text-center">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.maxValue ?? item.value));

  return (
    <div
      className={`bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 ${className}`}
    >
      {title && <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-6">{title}</h3>}

      <div className="space-y-3">
        {data.map(item => {
          const percentage = (item.value / maxValue) * 100;
          const barWidth = (percentage / 100) * 100;

          return (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-main dark:text-slate-100">{item.label}</p>
                {showValues && (
                  <span className="text-sm font-medium text-text-main dark:text-slate-100">{item.value}</span>
                )}
              </div>

              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ease-out ${item.color ?? 'bg-accent'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
