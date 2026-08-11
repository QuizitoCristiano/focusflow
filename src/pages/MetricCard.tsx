import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, status = 'neutral', icon }) => {
  const statusColors = {
    success: 'bg-brand-success/10 border-brand-success/30 text-brand-success',
    warning: 'bg-brand-alert/10 border-brand-alert/30 text-brand-alert',
    danger: 'bg-brand-alert/15 border-brand-alert/40 text-brand-alert',
    neutral: 'bg-bg-card border-white/5 text-text-main',
  };

  return (
    <div className={`p-5 rounded-2xl border ${statusColors[status]} shadow-sm flex items-center justify-between backdrop-blur-md`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">{title}</p>
        <p className="text-2xl font-extrabold text-text-main">{value}</p>
        {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      </div>
      {icon && <span className="text-3xl opacity-90">{icon}</span>}
    </div>
  );
};