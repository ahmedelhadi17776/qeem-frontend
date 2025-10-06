import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  icon?: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, trend, icon, className = '' }: StatCardProps) {
  const getTrendColor = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'stable':
        return 'text-text-muted dark:text-slate-400';
      default:
        return 'text-text-muted dark:text-slate-400';
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'stable':
        return '→';
      default:
        return '';
    }
  };

  return (
    <div
      className={`bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-muted dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-main dark:text-slate-100">{value}</p>
          {subtitle && <p className="text-sm text-text-muted dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${getTrendColor(trend.direction)}`}>
            {getTrendIcon(trend.direction)} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-text-muted dark:text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}
