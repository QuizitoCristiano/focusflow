import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

interface ReportData {
  id: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  totalMinutes: number;
  averageDailyMinutes: number;
  dailyGoalMinutes: number;
  goalCompletionPercentage: number;
  variationPercentage: number;
  previousTotalMinutes: number;
  peakDay: string;
  peakDayMinutes: number;
  lowestDay: string;
  lowestDayMinutes: number;
  appBreakdown: { appName: string; minutes: number; goalMinutes: number }[];
  appGoalsStatus: { appName: string; met: boolean }[];
  diagnosticText: string;
  positivePoints: string[];
  attentionPoints: string[];
  recommendations: { id: string; text: string; priority: 'Alta' | 'Média' | 'Baixa' }[];
}

export const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('03/08/2026 – 09/08/2026');

  // Dados consolidados do Relatório Atual (Cruzamento das coleções do Firestore)
  const currentReport: ReportData = {
    id: 'rep-2026-08-09',
    periodLabel: 'Esta semana',
    startDate: '03/08/2026',
    endDate: '09/08/2026',
    totalMinutes: 1662, // 27h 42min
    averageDailyMinutes: 237, // 3h 57min
    dailyGoalMinutes: 240, // 4h 00min
    goalCompletionPercentage: 72,
    variationPercentage: -8.4,
    previousTotalMinutes: 1815, // 30h 15min
    peakDay: 'Quarta-feira',
    peakDayMinutes: 320, // 5h 20min
    lowestDay: 'Domingo',
    lowestDayMinutes: 170, // 2h 50min
    appBreakdown: [
      { appName: 'Instagram', minutes: 432, goalMinutes: 210 }, // 7h 12m vs 3h 30m
      { appName: 'YouTube', minutes: 340, goalMinutes: 420 },   // 5h 40m vs 7h 00m
      { appName: 'WhatsApp', minutes: 260, goalMinutes: 420 },  // 4h 20m vs 7h 00m
      { appName: 'Chrome', minutes: 195, goalMinutes: 315 },    // 3h 15m vs 5h 15m
      { appName: 'TikTok', minutes: 180, goalMinutes: 140 },    // 3h 00m vs 2h 20m
    ],
    appGoalsStatus: [
      { appName: 'Instagram', met: false },
      { appName: 'WhatsApp', met: true },
      { appName: 'YouTube', met: true },
      { appName: 'TikTok', met: false },
      { appName: 'Chrome', met: true },
    ],
    diagnosticText: 'Seu uso permaneceu dentro da meta durante a maior parte da semana. Entretanto, foram identificados picos de utilização durante o período noturno (22h–02h), principalmente relacionados a redes sociais.',
    positivePoints: [
      'Redução de 8,4% (-2h 33min) no tempo total de tela.',
      'Cumprimento da meta diária em 5 dos 7 dias analisados.',
      'Queda constante no tempo gasto no YouTube (-1h 20min).'
    ],
    attentionPoints: [
      'Instagram excedeu a meta estipulada em 3h 42min acumulados.',
      'Picos recorrentes de navegação após as 22:00.',
      'Quarta-feira apresentou o maior pico de tempo de uso (5h 20min).'
    ],
    recommendations: [
      { id: '1', text: 'Reduzir Instagram em aproximadamente 15 minutos por dia.', priority: 'Alta' },
      { id: '2', text: 'Evitar utilização de redes sociais após as 22h00.', priority: 'Alta' },
      { id: '3', text: 'Manter o limite atual configurado para o YouTube.', priority: 'Baixa' },
      { id: '4', text: 'Buscar manter a média diária geral sempre abaixo de 4 horas.', priority: 'Média' },
    ]
  };

  const formatHoursMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}min`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12 select-none">
      
      {/* 1. Cabeçalho da Página com Seletores de Período e Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <span>📄</span> Relatório de Bem-Estar Digital
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Consolidação completa de consumo, diagnósticos e recomendações do período.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Período */}
          <div className="flex items-center gap-2 bg-bg-card border border-white/10 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-brand-accent" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-xs font-semibold text-text-main focus:outline-none"
            >
              <option value="03/08/2026 – 09/08/2026">03/08/2026 – 09/08/2026 (Esta semana)</option>
              <option value="27/07/2026 – 02/08/2026">27/07/2026 – 02/08/2026 (Semana anterior)</option>
              <option value="Últimos 30 dias">Últimos 30 dias</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-bg-main font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Banner Informativo LGPD / Segurança */}
      <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-text-muted flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-brand-success shrink-0" />
        <span>
          Relatório gerado estritamente para o seu perfil (Firestore Security Rules ativas). Nenhum dado é compartilhado externamente.
        </span>
      </div>

      {/* DOCUMENTO DO RELATÓRIO CONSOLIDADO */}
      <div className="space-y-8 bg-bg-card p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl">

        {/* Header do Documento */}
        <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-accent">
              FocusFlow • Consolidação Semanal
            </span>
            <h2 className="text-xl font-bold text-text-main mt-0.5">
              Período: {currentReport.startDate} – {currentReport.endDate}
            </h2>
          </div>
          <div className="text-left sm:text-right text-xs text-text-muted">
            <p>Gerado em: <strong className="text-text-main">09/08/2026 às 23:59</strong></p>
            <p>Status da Meta Geral: <strong className="text-brand-success">72% de Cumprimento</strong></p>
          </div>
        </div>

        {/* ① Resumo Geral */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>①</span> Resumo Geral
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            
            <div className="p-3.5 bg-bg-main rounded-xl border border-white/5">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Tempo Total</span>
              <span className="text-base font-extrabold text-text-main mt-1 block">
                {formatHoursMinutes(currentReport.totalMinutes)}
              </span>
            </div>

            <div className="p-3.5 bg-bg-main rounded-xl border border-white/5">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Média Diária</span>
              <span className="text-base font-extrabold text-text-main mt-1 block">
                {formatHoursMinutes(currentReport.averageDailyMinutes)}
              </span>
            </div>

            <div className="p-3.5 bg-bg-main rounded-xl border border-white/5">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Meta Diária</span>
              <span className="text-base font-extrabold text-brand-accent mt-1 block">
                {formatHoursMinutes(currentReport.dailyGoalMinutes)}
              </span>
            </div>

            <div className="p-3.5 bg-bg-main rounded-xl border border-white/5">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Cumprimento</span>
              <span className="text-base font-extrabold text-brand-success mt-1 block">
                {currentReport.goalCompletionPercentage}%
              </span>
            </div>

            <div className="p-3.5 bg-bg-main rounded-xl border border-white/5 col-span-2 sm:col-span-1">
              <span className="block text-[10px] font-bold text-text-muted uppercase">Variação</span>
              <span className="text-base font-extrabold text-brand-success mt-1 block flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                {currentReport.variationPercentage}%
              </span>
            </div>

          </div>
        </section>

        {/* ② Evolução Comparativa */}
        <section className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>②</span> Evolução Temporal
          </h3>
          <div className="p-4 bg-bg-main rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <span className="text-text-muted">Semana atual: <strong className="text-text-main">{formatHoursMinutes(currentReport.totalMinutes)}</strong></span>
                <span className="text-text-muted">Semana anterior: <strong className="text-text-main">{formatHoursMinutes(currentReport.previousTotalMinutes)}</strong></span>
              </div>
              <p className="text-brand-success font-semibold">
                ✓ Seu tempo de uso diminuiu {Math.abs(currentReport.variationPercentage)}% (-2h 33min) em relação ao período anterior.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-brand-success/15 border border-brand-success/30 rounded-lg text-brand-success font-bold shrink-0">
              Diferença: -2h 33min
            </div>
          </div>
        </section>

        {/* ③ Uso por Aplicativos */}
        <section className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>③</span> Detalhamento por Aplicativo
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-text-muted font-bold">
                  <th className="pb-2.5">Aplicativo</th>
                  <th className="pb-2.5">Tempo Utilizado</th>
                  <th className="pb-2.5">Meta do Período</th>
                  <th className="pb-2.5 text-right">Diferença / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentReport.appBreakdown.map((app) => {
                  const diff = app.minutes - app.goalMinutes;
                  const isOver = diff > 0;

                  return (
                    <tr key={app.appName}>
                      <td className="py-3 font-bold text-text-main">{app.appName}</td>
                      <td className="py-3 font-mono text-text-main">{formatHoursMinutes(app.minutes)}</td>
                      <td className="py-3 text-text-muted">{formatHoursMinutes(app.goalMinutes)}</td>
                      <td className="py-3 text-right font-bold">
                        {isOver ? (
                          <span className="text-brand-alert">+{formatHoursMinutes(diff)}</span>
                        ) : (
                          <span className="text-brand-success">-{formatHoursMinutes(Math.abs(diff))}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ④ Dias de Pico */}
        <section className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>④</span> Análise de Picos e Valores Mínimos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-bg-main rounded-xl border border-white/5 space-y-1">
              <span className="text-text-muted font-bold uppercase text-[10px]">Maior Utilização (Pico)</span>
              <p className="font-bold text-brand-alert text-sm">
                {currentReport.peakDay} — {formatHoursMinutes(currentReport.peakDayMinutes)}
              </p>
            </div>
            <div className="p-3.5 bg-bg-main rounded-xl border border-white/5 space-y-1">
              <span className="text-text-muted font-bold uppercase text-[10px]">Menor Utilização</span>
              <p className="font-bold text-brand-success text-sm">
                {currentReport.lowestDay} — {formatHoursMinutes(currentReport.lowestDayMinutes)}
              </p>
            </div>
          </div>
        </section>

        {/* ⑤ Status das Metas */}
        <section className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>⑤</span> Avaliação de Metas
          </h3>
          <div className="p-4 bg-bg-main rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-text-muted">Meta Geral do Celular</span>
              <span className="text-brand-success">72% Cumprida</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {currentReport.appGoalsStatus.map((item) => (
                <div 
                  key={item.appName} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                    item.met 
                      ? 'bg-brand-success/10 border-brand-success/30 text-brand-success' 
                      : 'bg-brand-alert/10 border-brand-alert/30 text-brand-alert'
                  }`}
                >
                  {item.met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{item.appName}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑥ Diagnóstico Processado */}
        <section className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>⑥</span> Diagnóstico Comportamental
          </h3>
          <div className="p-4 bg-bg-main rounded-xl border border-white/5 space-y-3 text-xs">
            <p className="text-text-main leading-relaxed font-medium">
              "{currentReport.diagnosticText}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              {/* Pontos Positivos */}
              <div className="space-y-2">
                <span className="font-bold text-brand-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pontos Positivos</span>
                </span>
                <ul className="space-y-1 list-disc list-inside text-text-muted">
                  {currentReport.positivePoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Pontos de Atenção */}
              <div className="space-y-2">
                <span className="font-bold text-brand-alert flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Pontos de Atenção</span>
                </span>
                <ul className="space-y-1 list-disc list-inside text-text-muted">
                  {currentReport.attentionPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ⑦ Recomendações Priorizadas */}
        <section className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <span>⑦</span> Recomendações para o Próximo Período
          </h3>
          <div className="space-y-2">
            {currentReport.recommendations.map((rec) => {
              const priorityColors = {
                Alta: 'bg-brand-alert/15 text-brand-alert border-brand-alert/30',
                Média: 'bg-brand-accent/15 text-brand-accent border-brand-accent/30',
                Baixa: 'bg-brand-success/15 text-brand-success border-brand-success/30',
              };

              return (
                <div 
                  key={rec.id} 
                  className="p-3.5 bg-bg-main rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-medium text-text-main">{rec.text}</span>
                  <span className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase shrink-0 ${priorityColors[rec.priority]}`}>
                    {rec.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

      </div>

    </div>
  );
};