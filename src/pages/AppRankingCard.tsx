import React from 'react';

interface AppUsageItem {
  appName: string;
  formattedTime: string;
  minutes: number;
  maxMinutes?: number;
}

interface AppRankingCardProps {
  apps: AppUsageItem[];
}

export const AppRankingCard: React.FC<AppRankingCardProps> = ({ apps }) => {
  return (
    <div className="bg-bg-card p-6 rounded-2xl border border-white/5 shadow-sm">
      <h3 className="text-base font-bold text-text-main mb-4">
        Aplicativos mais utilizados
      </h3>
      
      <div className="space-y-4">
        {apps.map((app) => {
          const maxVal = apps[0]?.minutes || 1;
          const percentage = Math.min(100, Math.round((app.minutes / maxVal) * 100));

          return (
            <div key={app.appName} className="space-y-1.5">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-text-main">{app.appName}</span>
                <span className="font-semibold text-brand-alert">{app.formattedTime}</span>
              </div>
              
              {/* Barra de Progresso Customizada */}
              <div className="w-full bg-bg-main rounded-full h-2.5 overflow-hidden border border-white/5">
                <div
                  className="bg-brand-alert h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};