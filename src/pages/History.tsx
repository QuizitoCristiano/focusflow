import React, { useState, useMemo } from 'react';
import { 
  History as HistoryIcon, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Sparkles, 
  Clock, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { useScreenTime } from '@/contexto/ScreenTimeContext';
import { useGoals } from '@/contexto/GoalsContext';

interface HistoryRecord {
  id: string;
  startDate: string;
  endDate: string;
  totalMinutes: number;
  averageDailyMinutes: number;
  goalCompletionPercentage: number;
  variationPercentage: number;
  topApp: string;
  topAppMinutes: number;
  peakDay: string;
  peakDayMinutes: number;
  diagnosticSummary: string;
  recommendations: string[];
  appBreakdown: { appName: string; minutes: number }[];
}

export const History: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Últimas 4 semanas');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const { entries, loading: loadingEntries } = useScreenTime();
  const { generalGoalMinutes, loading: loadingGoals } = useGoals();

  const dailyGoalMinutes = generalGoalMinutes || 240; // 4h por padrão

  const formatHoursMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}min`;
  };

  // Algoritmo de Agregação: Transforma documentos diários em blocos semanais (Seg - Dom)
  const historyData = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    // 1. Agrupa os registros por chave semanal (Ano-Semana)
    const weeksMap: { [weekKey: string]: { date: Date; entry: typeof entries[0] }[] } = {};

    entries.forEach(entry => {
      const entryDate = new Date(`${entry.date}T00:00:00`);
      const day = entryDate.getDay();
      
      // Ajusta para início da semana na Segunda-feira
      const diffToMonday = entryDate.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(entryDate.setDate(diffToMonday));
      const weekKey = monday.toISOString().split('T')[0];

      if (!weeksMap[weekKey]) {
        weeksMap[weekKey] = [];
      }
      weeksMap[weekKey].push({ date: new Date(`${entry.date}T00:00:00`), entry });
    });

    // 2. Ordena as semanas da mais recente para a mais antiga
    const sortedWeekKeys = Object.keys(weeksMap).sort((a, b) => b.localeCompare(a));

    // Limitador do filtro visual
    const limitWeeks = selectedPeriod === 'Últimas 4 semanas' ? 4 : selectedPeriod === 'Últimos 3 meses' ? 12 : 52;
    const filteredWeekKeys = sortedWeekKeys.slice(0, limitWeeks);

    // 3. Processa cada semana e calcula as métricas reais
    const processedRecords: HistoryRecord[] = filteredWeekKeys.map((weekKey, index) => {
      const weekItems = weeksMap[weekKey];
      
      const mondayDate = new Date(`${weekKey}T00:00:00`);
      const sundayDate = new Date(mondayDate);
      sundayDate.setDate(mondayDate.getDate() + 6);

      const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

      // Agrupamento por dia dentro da semana
      const dailyTotals: { [dateStr: string]: { totalMinutes: number; dayName: string; apps: { [app: string]: number } } } = {};
      const appTotals: { [appName: string]: number } = {};

      weekItems.forEach(({ date, entry }) => {
        const dateStr = entry.date;
        if (!dailyTotals[dateStr]) {
          dailyTotals[dateStr] = {
            totalMinutes: 0,
            dayName: daysOfWeek[date.getDay()],
            apps: {}
          };
        }
        dailyTotals[dateStr].totalMinutes += entry.minutes;
        dailyTotals[dateStr].apps[entry.appName] = (dailyTotals[dateStr].apps[entry.appName] || 0) + entry.minutes;

        appTotals[entry.appName] = (appTotals[entry.appName] || 0) + entry.minutes;
      });

      const totalMinutes = Object.values(dailyTotals).reduce((acc, d) => acc + d.totalMinutes, 0);
      const averageDailyMinutes = Math.round(totalMinutes / 7);

      // Dias dentro da meta
      const daysWithinGoal = Object.values(dailyTotals).filter(d => d.totalMinutes <= dailyGoalMinutes).length;
      const goalCompletionPercentage = Math.round((daysWithinGoal / 7) * 100);

      // Maior pico
      let peakDay = 'N/A';
      let peakDayMinutes = 0;
      Object.values(dailyTotals).forEach(d => {
        if (d.totalMinutes > peakDayMinutes) {
          peakDayMinutes = d.totalMinutes;
          peakDay = d.dayName;
        }
      });

      // Ranking de apps da semana
      const appBreakdown = Object.entries(appTotals)
        .map(([appName, minutes]) => ({ appName, minutes }))
        .sort((a, b) => b.minutes - a.minutes);

      const topAppObj = appBreakdown[0] || { appName: 'Nenhum', minutes: 0 };

      // Variação percentual em relação à semana anterior na lista
      let variationPercentage = 0;
      const nextWeekKey = sortedWeekKeys[index + 1];
      if (nextWeekKey && weeksMap[nextWeekKey]) {
        const prevWeekTotal = weeksMap[nextWeekKey].reduce((acc, curr) => acc + curr.entry.minutes, 0);
        if (prevWeekTotal > 0) {
          variationPercentage = parseFloat((((totalMinutes - prevWeekTotal) / prevWeekTotal) * 100).toFixed(1));
        }
      }

      return {
        id: `sem-${weekKey}`,
        startDate: formatDate(mondayDate),
        endDate: formatDate(sundayDate),
        totalMinutes,
        averageDailyMinutes,
        goalCompletionPercentage,
        variationPercentage,
        topApp: topAppObj.appName,
        topAppMinutes: topAppObj.minutes,
        peakDay,
        peakDayMinutes,
        diagnosticSummary: totalMinutes > dailyGoalMinutes * 7
          ? `O uso nesta semana superou a meta estipulada. O maior volume de tempo concentrou-se no aplicativo ${topAppObj.appName}.`
          : `Excelente desempenho! O tempo total manteve-se alinhado com as metas configuradas no sistema.`,
        recommendations: [
          `Manter atenção ao consumo do aplicativo ${topAppObj.appName}`,
          `Estipular um tempo limite em dias de pico como ${peakDay}`
        ],
        appBreakdown
      };
    });

    return processedRecords;
  }, [entries, dailyGoalMinutes, selectedPeriod]);

  const currentRecord = historyData[0];

  if (loadingEntries || loadingGoals) {
    return (
      <div className="flex items-center justify-center p-12 text-text-muted text-xs">
        Carregando histórico de navegação...
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="p-8 text-center bg-bg-card rounded-2xl border border-white/5 space-y-3">
        <HistoryIcon className="w-8 h-8 text-text-muted mx-auto" />
        <h3 className="text-base font-bold text-text-main">Nenhum histórico registrado</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Comece a registrar seu tempo de uso na aba "Tempo" para acompanhar a sua evolução semanal aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl pb-12 select-none">
      
      {/* 1. Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <span>📚</span> Histórico & Evolução
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Acompanhe a mudança nos seus hábitos digitais e a eficácia do seu plano de ação ao longo das semanas.
          </p>
        </div>

        {/* Filtro de Janela Temporal */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-muted" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-bg-card border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-text-main focus:outline-none"
          >
            <option value="Últimas 4 semanas">Últimas 4 semanas</option>
            <option value="Últimos 3 meses">Últimos 3 meses</option>
            <option value="Todo o histórico">Todo o histórico</option>
          </select>
        </div>
      </div>

      {/* 2. Resumo Superior de Evolução (Semana Mais Recente) */}
      {currentRecord && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Tempo Total */}
          <div className="p-5 bg-bg-card rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-text-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Tempo Total (Semana)</span>
              <Clock className="w-4 h-4 text-brand-accent" />
            </div>
            <p className="text-2xl font-extrabold text-text-main">
              {formatHoursMinutes(currentRecord.totalMinutes)}
            </p>
            <div className={`flex items-center gap-1.5 text-xs font-bold ${
              currentRecord.variationPercentage <= 0 ? 'text-brand-success' : 'text-brand-alert'
            }`}>
              {currentRecord.variationPercentage <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              <span>{Math.abs(currentRecord.variationPercentage)}% comparado à semana anterior</span>
            </div>
          </div>

          {/* Card 2: Média Diária */}
          <div className="p-5 bg-bg-card rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-text-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Média Diária</span>
              <Layers className="w-4 h-4 text-text-muted" />
            </div>
            <p className="text-2xl font-extrabold text-text-main">
              {formatHoursMinutes(currentRecord.averageDailyMinutes)}
            </p>
            <p className="text-xs font-semibold text-text-muted">
              Meta configurada: {formatHoursMinutes(dailyGoalMinutes)}/dia
            </p>
          </div>

          {/* Card 3: Metas Atingidas */}
          <div className="p-5 bg-bg-card rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-text-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Aproveitamento de Meta</span>
              <CheckCircle2 className="w-4 h-4 text-brand-success" />
            </div>
            <p className="text-2xl font-extrabold text-brand-success">
              {currentRecord.goalCompletionPercentage}%
            </p>
            <p className="text-xs text-text-muted">
              Dias dentro da meta nesta semana
            </p>
          </div>

        </div>
      )}

      {/* 3. Gráfico de Evolução Comportamental */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-main flex items-center gap-2">
              <span>📈</span> Evolução do Tempo de Tela
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Média diária registrada em cada ciclo semanal.</p>
          </div>
        </div>

        {/* Simulação Visual de Gráfico */}
        <div className="pt-6 pb-2 flex items-end justify-between gap-4 h-44 border-b border-white/10 px-4">
          {historyData.slice().reverse().map((rec, index) => {
            const maxHeight = 360; // Teto visual de 6 horas em minutos
            const heightPercent = Math.min(Math.round((rec.averageDailyMinutes / maxHeight) * 100), 100);

            return (
              <div key={rec.id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatHoursMinutes(rec.averageDailyMinutes)}
                </span>
                <div 
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                    index === historyData.length - 1 ? 'bg-brand-accent' : 'bg-white/15 hover:bg-white/25'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-bold text-text-muted mt-1">S{index + 1}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Tabela de Registros Semanais */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
          <span>🗓️</span> Registros Semanais Consolidados
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-text-muted font-bold">
                <th className="pb-3 pl-2">Período</th>
                <th className="pb-3">Tempo Total</th>
                <th className="pb-3">Média Diária</th>
                <th className="pb-3">Cumprimento</th>
                <th className="pb-3">App Mais Utilizado</th>
                <th className="pb-3">Variação</th>
                <th className="pb-3 pr-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyData.map((rec) => {
                const isImproved = rec.variationPercentage <= 0;

                return (
                  <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pl-2 font-bold text-text-main">
                      {rec.startDate} – {rec.endDate}
                    </td>
                    <td className="py-4 text-text-main font-semibold">
                      {formatHoursMinutes(rec.totalMinutes)}
                    </td>
                    <td className="py-4 text-text-muted">
                      {formatHoursMinutes(rec.averageDailyMinutes)}
                    </td>
                    <td className="py-4 font-bold text-brand-success">
                      {rec.goalCompletionPercentage}%
                    </td>
                    <td className="py-4 text-text-main">
                      {rec.topApp} <span className="text-text-muted font-normal">({formatHoursMinutes(rec.topAppMinutes)})</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        isImproved ? 'text-brand-success' : 'text-brand-alert'
                      }`}>
                        {isImproved ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                        {rec.variationPercentage > 0 ? `+${rec.variationPercentage}%` : `${rec.variationPercentage}%`}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-brand-accent font-semibold rounded-xl text-xs transition-all inline-flex items-center gap-1"
                      >
                        <span>Ver detalhes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal 5: Inspeção Detalhada da Semana */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase">
                <HistoryIcon className="w-4 h-4" />
                <span>Detalhamento Histórico</span>
              </div>
              <h3 className="text-xl font-bold text-text-main">
                Semana: {selectedRecord.startDate} – {selectedRecord.endDate}
              </h3>
            </div>

            {/* Resumo Métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bg-main p-4 rounded-xl border border-white/5">
              <div>
                <span className="block text-[10px] text-text-muted font-bold uppercase">Tempo Total</span>
                <span className="text-sm font-extrabold text-text-main">{formatHoursMinutes(selectedRecord.totalMinutes)}</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted font-bold uppercase">Média Diária</span>
                <span className="text-sm font-extrabold text-text-main">{formatHoursMinutes(selectedRecord.averageDailyMinutes)}</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted font-bold uppercase">Cumprimento</span>
                <span className="text-sm font-extrabold text-brand-success">{selectedRecord.goalCompletionPercentage}%</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted font-bold uppercase">Maior Pico</span>
                <span className="text-sm font-extrabold text-brand-alert">{selectedRecord.peakDay}</span>
              </div>
            </div>

            {/* Breakdown por Aplicativo */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Uso por Aplicativo</h4>
              <div className="space-y-2">
                {selectedRecord.appBreakdown.map((app) => (
                  <div key={app.appName} className="flex items-center justify-between bg-bg-main px-3 py-2 rounded-xl border border-white/5 text-xs">
                    <span className="font-bold text-text-main">{app.appName}</span>
                    <span className="font-mono text-text-muted">{formatHoursMinutes(app.minutes)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnóstico Vinculado */}
            <div className="space-y-2 p-4 bg-brand-alert/10 border border-brand-alert/20 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-brand-alert font-bold uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Diagnóstico do Período</span>
              </div>
              <p className="text-text-main leading-relaxed">
                {selectedRecord.diagnosticSummary}
              </p>
            </div>

            {/* Recomendações Associadas */}
            <div className="space-y-2 p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-brand-accent font-bold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Recomendações Geradas</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-text-main">
                {selectedRecord.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Footer do Modal */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-text-main font-bold rounded-xl text-xs transition-all"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};