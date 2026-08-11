import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from './MetricCard';
import { AppRankingCard } from './AppRankingCard';
import { useScreenTime } from '@/contexto/ScreenTimeContext';
import { useGoals } from '@/contexto/GoalsContext';
import { useAuth } from '@/contexto/useAuth';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entries, loading: loadingEntries } = useScreenTime();
  const { generalGoalMinutes, appGoals, loading: loadingGoals } = useGoals();

  // 1. Processamento de Datas (Últimos 7 Dias: de 6 dias atrás até Hoje)
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date();
  
  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - index));
    const dateStr = d.toISOString().split('T')[0];
    return {
      dateStr,
      dayLabel: daysOfWeek[d.getDay()],
    };
  });

  // Meta diária em minutos (padrão 4h / 240min se não configurado)
  const goalMinutes = generalGoalMinutes || 240;

  // 2. Cálculo do Uso Diário nos Últimos 7 Dias
  let totalMinutesLast7Days = 0;
  let daysWithinGoalCount = 0;
  let daysWithDataCount = 0;

  const weeklyUsage = last7Days.map(({ dateStr, dayLabel }) => {
    // Registros específicos do dia
    const dayEntries = (entries || []).filter(e => e.date === dateStr);
    const dayTotalMinutes = dayEntries.reduce((acc, item) => acc + item.minutes, 0);

    if (dayEntries.length > 0) {
      daysWithDataCount++;
    }

    totalMinutesLast7Days += dayTotalMinutes;

    if (dayTotalMinutes <= goalMinutes && dayTotalMinutes > 0) {
      daysWithinGoalCount++;
    }

    return {
      day: dayLabel,
      hours: parseFloat((dayTotalMinutes / 60).toFixed(1)),
      totalMinutes: dayTotalMinutes,
      isOverGoal: dayTotalMinutes > goalMinutes,
    };
  });

  // 3. Cálculos dos Cards Principais
  const dailyAverageMinutes = Math.round(totalMinutesLast7Days / 7);
  const diffMinutes = dailyAverageMinutes - goalMinutes;
  const isAverageOverGoal = diffMinutes > 0;

  const formatHoursMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}min`;
  };

  // 4. Agrupamento e Ranking de Aplicativos nos últimos 7 dias
  const appTotalsMap: { [key: string]: number } = {};

  (entries || []).forEach(entry => {
    // Filtra para pegar apenas os registros pertencentes à janela dos 7 dias
    const isInLast7Days = last7Days.some(d => d.dateStr === entry.date);
    if (isInLast7Days) {
      const app = entry.appName;
      appTotalsMap[app] = (appTotalsMap[app] || 0) + entry.minutes;
    }
  });

  // Formatação do Top Apps
  const topApps = Object.entries(appTotalsMap)
    .map(([appName, minutes]) => ({
      appName,
      minutes,
      formattedTime: formatHoursMinutes(minutes),
      maxMinutes: Math.max(...Object.values(appTotalsMap), 1)
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5);

  // App Dominante para o Card de Diagnóstico
  const topApp = topApps[0];
  const topAppPercentage = totalMinutesLast7Days > 0 && topApp
    ? Math.round((topApp.minutes / totalMinutesLast7Days) * 100)
    : 0;

  if (loadingEntries || loadingGoals) {
    return (
      <div className="flex items-center justify-center p-12 text-text-muted text-xs">
        Carregando métricas da Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header de Boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Bom dia, {user?.displayName || user?.email?.split('@')[0] || 'Usuário'} 👋
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Veja como está seu tempo de tela e seu progresso em relação às suas metas nesta semana.
          </p>
        </div>

        <button
          onClick={() => navigate('/modo-de-uso')}
          className="px-5 py-2.5 bg-brand-alert hover:bg-brand-alert/90 text-white font-semibold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2 shrink-0"
        >
          <span>+</span> Registrar Tempo de Uso
        </button>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Média Diária"
          value={formatHoursMinutes(dailyAverageMinutes)}
          subtitle="Baseado nos últimos 7 dias"
          status={isAverageOverGoal ? "warning" : "success"}
          icon="⏱️"
        />
        <MetricCard
          title="Meta Diária"
          value={formatHoursMinutes(goalMinutes)}
          subtitle="Limite configurado"
          status="neutral"
          icon="🎯"
        />
        <MetricCard
          title="Dentro da Meta"
          value={`${daysWithinGoalCount} / 7 dias`}
          subtitle={
            daysWithDataCount < 7
              ? `Dados incompletos: ${daysWithDataCount}/7 dias registrados`
              : "Dias cumpridos nesta semana"
          }
          status={daysWithinGoalCount >= 4 ? "success" : "danger"}
          icon="📊"
        />
      </div>

      {/* Seção Principal: Gráfico Semanal + Top Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Gráfico Visual do Tempo Semanal */}
        <div className="lg:col-span-2 bg-bg-card p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-text-main">Uso Semanal</h3>
              <p className="text-xs text-text-muted">Distribuição diária de horas registradas</p>
            </div>
            
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
              isAverageOverGoal
                ? 'bg-brand-alert/15 text-brand-alert border-brand-alert/30'
                : 'bg-brand-success/15 text-brand-success border-brand-success/30'
            }`}>
              {isAverageOverGoal
                ? `Acima da Meta (+${diffMinutes} min/dia)`
                : `Dentro da Meta (-${Math.abs(diffMinutes)} min/dia)`}
            </span>
          </div>

          {/* Barras do Gráfico */}
          <div className="h-48 flex items-end justify-between gap-3 px-2">
            {weeklyUsage.map((item) => {
              // Escala dinâmica considerando teto visual de 6 horas
              const heightPercentage = Math.min(100, (item.hours / 6) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className={`text-xs font-semibold ${item.isOverGoal ? 'text-brand-alert' : 'text-brand-accent'}`}>
                    {item.hours}h
                  </span>
                  <div className="w-full bg-bg-main rounded-t-lg relative flex items-end h-36 border border-white/5 overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        item.isOverGoal ? 'bg-brand-alert' : 'bg-brand-accent'
                      }`}
                      style={{ height: `${heightPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-text-muted">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ranking de Aplicativos */}
        <div className="lg:col-span-1">
          <AppRankingCard apps={topApps} />
        </div>
      </div>

      {/* Banner de Diagnóstico */}
      <div className="bg-bg-card border border-brand-alert/30 text-text-main p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-alert animate-pulse" />
            <h3 className="text-lg font-bold">Diagnóstico Semanal Disponível</h3>
          </div>
          <p className="text-sm text-text-muted mt-1">
            {topApp ? (
              <>Identificamos que o uso do <strong>{topApp.appName}</strong> representa <strong>{topAppPercentage}%</strong> do seu tempo total de tela nesta semana.</>
            ) : (
              <>Registre seu uso diário para desbloquear análises completas de comportamento digital.</>
            )}
          </p>
        </div>
        <button
          onClick={() => navigate('/diagnostic')}
          className="px-6 py-3 bg-brand-alert hover:bg-brand-alert/90 text-white font-semibold rounded-xl text-sm transition-all whitespace-nowrap shadow shrink-0"
        >
          Ver Diagnóstico Completo →
        </button>
      </div>
    </div>
  );
};