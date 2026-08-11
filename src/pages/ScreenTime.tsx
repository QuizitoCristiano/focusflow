import React, { useState } from 'react';
import {
  Clock,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  X,
  Smartphone,
  Layers,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useScreenTime } from '@/contexto/ScreenTimeContext';
import { useGoals } from '@/contexto/GoalsContext';
import type { ScreenTimeEntry } from '@/types/firestore';

export const ScreenTime: React.FC = () => {
  const { entries, loading, addScreenTimeEntry, deleteScreenTimeEntry } = useScreenTime();
  const { appGoals, generalGoalMinutes } = useGoals();

  const [period, setPeriod] = useState('Hoje');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isSingleRegisterOpen, setIsSingleRegisterOpen] = useState(false);
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Form
  const [singleDate, setSingleDate] = useState(todayStr);
  const [singleAppName, setSingleAppName] = useState('Instagram');
  const [singleHours, setSingleHours] = useState('01');
  const [singleMinutes, setSingleMinutes] = useState('12');
  const [singleCategory, setSingleCategory] = useState<ScreenTimeEntry['category']>('Redes Sociais');
  const [singleSource, setSingleSource] = useState<ScreenTimeEntry['source']>('Samsung Bem-Estar Digital');
  const [singleNote, setSingleNote] = useState('');

  const [quickUsages, setQuickUsages] = useState([
    { appName: 'Instagram', minutes: 72, category: 'Redes Sociais' as const },
    { appName: 'WhatsApp', minutes: 45, category: 'Comunicação' as const },
    { appName: 'YouTube', minutes: 65, category: 'Entretenimento' as const },
    { appName: 'Chrome', minutes: 38, category: 'Navegação' as const },
    { appName: 'TikTok', minutes: 52, category: 'Redes Sociais' as const },
  ]);

  const categories = ['Todas', 'Redes Sociais', 'Entretenimento', 'Comunicação', 'Navegação', 'Trabalho', 'Estudos', 'Outro'];

  // CÁLCULO DINÂMICO DOS ÚLTIMOS 7 DIAS BASEADO NO FIRESTORE
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const now = new Date();

  const last7DaysData = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - index));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = daysOfWeek[d.getDay()];

    const totalMins = (entries || [])
      .filter(e => e.date === dateStr)
      .reduce((acc, item) => acc + item.minutes, 0);

    return {
      date: dateStr,
      day: dayLabel,
      mins: totalMins
    };
  });

  const maxMinsWeekly = Math.max(...last7DaysData.map(d => d.mins), 1);
  const peakDay = last7DaysData.find(d => d.mins === maxMinsWeekly && d.mins > 0);

  // Totais Hoje
  const todayEntries = (entries || []).filter(e => e.date === todayStr);
  const totalMinutes = todayEntries.reduce((acc, item) => acc + item.minutes, 0);
  const totalGoalMinutes = generalGoalMinutes || 240;
  const isOverGoal = totalMinutes > totalGoalMinutes;
  const excessMinutes = totalMinutes - totalGoalMinutes;
  const percentageOfGoal = Math.round((totalMinutes / totalGoalMinutes) * 100);

  const formatHoursMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}min`;
  };

  const filteredApps = selectedCategory === 'Todas'
    ? todayEntries
    : todayEntries.filter(app => app.category === selectedCategory);

  const handleSaveSingleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalMins = (parseInt(singleHours, 10) || 0) * 60 + (parseInt(singleMinutes, 10) || 0);
    if (totalMins <= 0 || !singleAppName) return;

    await addScreenTimeEntry({
      date: singleDate,
      appName: singleAppName,
      category: singleCategory,
      minutes: totalMins,
      source: singleSource,
      notes: singleNote
    });

    setIsSingleRegisterOpen(false);
  };

  const handleSaveQuickRegister = async () => {
    for (const item of quickUsages) {
      if (item.minutes > 0) {
        await addScreenTimeEntry({
          date: todayStr,
          appName: item.appName,
          category: item.category,
          minutes: item.minutes,
          source: 'Registro Manual',
          notes: 'Adicionado via Registro Rápido'
        });
      }
    }
    setIsQuickRegisterOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-text-muted text-xs">
        Carregando registros de uso...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
            📱 Tempo de Uso
          </h1>
          <p className="text-xs text-text-muted">
            Registre e acompanhe seu tempo de tela para alimentar o Diagnóstico e as Recomendações.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-bg-card border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-text-main focus:outline-none"
          >
            <option value="Hoje">Hoje</option>
            <option value="Ontem">Ontem</option>
            <option value="Esta semana">Esta semana</option>
            <option value="Semana passada">Semana passada</option>
          </select>

          <button
            onClick={() => setIsQuickRegisterOpen(true)}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-text-main font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-brand-accent" />
            <span>Registro Rápido</span>
          </button>

          <button
            onClick={() => setIsSingleRegisterOpen(true)}
            className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-bg-main font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar uso</span>
          </button>
        </div>
      </div>

      {/* 2. Resumo em Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-card rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase">Tempo Total</span>
            <Clock className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="text-2xl font-extrabold text-text-main">{formatHoursMinutes(totalMinutes)}</p>
          <p className="text-[11px] text-text-muted">Utilizados hoje</p>
        </div>

        <div className="p-4 bg-bg-card rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase">Meta Diária</span>
            <span className="text-xs font-bold text-brand-accent">{formatHoursMinutes(totalGoalMinutes)}</span>
          </div>
          <p className={`text-2xl font-extrabold ${isOverGoal ? 'text-brand-alert' : 'text-brand-success'}`}>
            {isOverGoal ? `+${excessMinutes} min` : 'Dentro da meta'}
          </p>
          <p className="text-[11px] text-text-muted">{isOverGoal ? 'Acima do limite diário' : 'Tempo dentro do esperado'}</p>
        </div>

        <div className="p-4 bg-bg-card rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase">Média Diária</span>
            <BarChart3 className="w-4 h-4 text-text-muted" />
          </div>
          <p className="text-2xl font-extrabold text-text-main">
            {formatHoursMinutes(Math.round(last7DaysData.reduce((a, b) => a + b.mins, 0) / 7))}
          </p>
          <p className="text-[11px] text-text-muted">Últimos 7 dias</p>
        </div>

        <div className="p-4 bg-bg-card rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-bold uppercase">Comparação</span>
            <TrendingUp className="w-4 h-4 text-brand-alert" />
          </div>
          <p className="text-2xl font-extrabold text-brand-alert">+12%</p>
          <p className="text-[11px] text-text-muted">Em relação à semana anterior</p>
        </div>
      </div>

      {/* 3. Meta Diária x Consumo */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-text-main">Meta Diária x Consumo</h2>
            <p className="text-xs text-text-muted">Visualização do teto geral configurado para o celular.</p>
          </div>
          <span className="text-sm font-extrabold text-text-main">
            {formatHoursMinutes(totalMinutes)} / {formatHoursMinutes(totalGoalMinutes)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-bg-main h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all ${isOverGoal ? 'bg-brand-alert' : 'bg-brand-success'}`}
              style={{ width: `${Math.min(percentageOfGoal, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className={isOverGoal ? 'text-brand-alert' : 'text-brand-success'}>
              {percentageOfGoal}% da meta atingida
            </span>
            <span className="text-text-muted">Limite: {formatHoursMinutes(totalGoalMinutes)}</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
          isOverGoal
            ? 'bg-brand-alert/10 border-brand-alert/30 text-brand-alert'
            : 'bg-brand-success/10 border-brand-success/30 text-brand-success'
        }`}>
          {isOverGoal ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>⚠️ Você ultrapassou sua meta diária geral em {excessMinutes} minutos.</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>✓ Você está dentro da sua meta diária de utilização.</span>
            </>
          )}
        </div>
      </section>

      {/* 4. Gráfico dos Últimos 7 Dias (Renderização Dinâmica) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-main flex items-center gap-2">
            <span>📊</span> Uso nos Últimos 7 Dias
          </h2>
          {peakDay && (
            <span className="text-xs text-brand-alert font-bold">
              Maior pico: {peakDay.day} ({formatHoursMinutes(peakDay.mins)})
            </span>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {last7DaysData.map((item) => {
            const isPeak = peakDay && item.date === peakDay.date;
            const barWidth = Math.min(Math.round((item.mins / (totalGoalMinutes * 1.5)) * 100), 100);

            return (
              <div key={item.date} className="flex items-center gap-3 text-xs">
                <span className="w-8 text-text-muted font-bold">{item.day}</span>
                <div className="flex-1 bg-bg-main h-6 rounded-lg overflow-hidden relative border border-white/5 flex items-center">
                  <div
                    className={`h-full rounded-lg transition-all ${
                      isPeak
                        ? 'bg-brand-accent'
                        : item.mins > totalGoalMinutes
                          ? 'bg-brand-alert'
                          : 'bg-white/20'
                    }`}
                    style={{ width: `${item.mins > 0 ? Math.max(barWidth, 8) : 0}%` }}
                  />
                  <span className="absolute left-2 text-[10px] font-bold text-text-main z-10">
                    {formatHoursMinutes(item.mins)} {isPeak ? '(Pico da Semana)' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Tabela de Aplicativos */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-text-main flex items-center gap-2">
            <span>📱</span> Uso por Aplicativo
          </h2>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-brand-accent/15 border-brand-accent text-brand-accent'
                    : 'bg-bg-main border-white/5 text-text-muted hover:text-text-main'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted border border-dashed border-white/10 rounded-xl">
            Nenhum registro encontrado para hoje nesta categoria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-text-muted font-bold">
                  <th className="pb-3 pl-2">Aplicativo</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Tempo Utilizado</th>
                  <th className="pb-3">Meta Configurada</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredApps.map((app) => {
                  const matchedGoal = appGoals.find(
                    g => g.appName.toLowerCase() === app.appName.toLowerCase()
                  );
                  const goalMins = matchedGoal ? matchedGoal.dailyLimitMinutes : 30;
                  const diff = app.minutes - goalMins;
                  const isOver = diff > 0;

                  return (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-text-main">{app.appName}</td>
                      <td className="py-3.5 text-text-muted">{app.category}</td>
                      <td className="py-3.5 font-bold text-text-main">{formatHoursMinutes(app.minutes)}</td>
                      <td className="py-3.5 text-text-muted">{formatHoursMinutes(goalMins)}</td>
                      <td className="py-3.5">
                        {isOver ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-alert/15 text-brand-alert border border-brand-alert/30 font-bold whitespace-nowrap">
                            🔴 +{diff} min
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-success/15 text-brand-success border border-brand-success/30 font-bold whitespace-nowrap">
                            🟢 Dentro da meta
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={() => app.id && deleteScreenTimeEntry(app.id)}
                          className="p-1.5 text-text-muted hover:text-brand-alert hover:bg-brand-alert/10 rounded-lg transition-all"
                          title="Excluir Registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modais */}
      {isSingleRegisterOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSingleRegister}
            className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsSingleRegisterOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-accent">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-main">Registrar Tempo de Uso</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-text-muted font-semibold mb-1">Data</label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full bg-bg-main border border-white/10 rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted font-semibold mb-1">Aplicativo</label>
                <input
                  type="text"
                  value={singleAppName}
                  onChange={(e) => setSingleAppName(e.target.value)}
                  placeholder="Ex: Instagram, TikTok..."
                  required
                  className="w-full bg-bg-main border border-white/10 rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted font-semibold mb-1">Horas</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={singleHours}
                    onChange={(e) => setSingleHours(e.target.value)}
                    className="w-full bg-bg-main border border-white/10 rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted font-semibold mb-1">Minutos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={singleMinutes}
                    onChange={(e) => setSingleMinutes(e.target.value)}
                    className="w-full bg-bg-main border border-white/10 rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted font-semibold mb-1">Categoria</label>
                <select
                  value={singleCategory}
                  onChange={(e) => setSingleCategory(e.target.value as ScreenTimeEntry['category'])}
                  className="w-full bg-bg-main border border-white/10 rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-accent"
                >
                  {categories.filter(c => c !== 'Todas').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-muted font-semibold mb-1">Fonte dos Dados</label>
                <select
                  value={singleSource}
                  onChange={(e) => setSingleSource(e.target.value as ScreenTimeEntry['source'])}
                  className="w-full bg-bg-main border border-white/10 rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-accent"
                >
                  <option value="Samsung Bem-Estar Digital">Samsung Bem-Estar Digital</option>
                  <option value="Apple Tempo de Uso">Apple Tempo de Uso</option>
                  <option value="Outro Dispositivo">Outro Dispositivo</option>
                  <option value="Registro Manual">Registro Manual</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSingleRegisterOpen(false)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-text-muted font-semibold rounded-xl text-xs transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-bg-main font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Salvar Registro
              </button>
            </div>
          </form>
        </div>
      )}

      {isQuickRegisterOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setIsQuickRegisterOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-accent">
              <Smartphone className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-main">Registro Rápido em Lote</h3>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {quickUsages.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 bg-bg-main p-2.5 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-text-main">{item.appName}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.minutes}
                      onChange={(e) => {
                        const updated = [...quickUsages];
                        updated[idx].minutes = parseInt(e.target.value, 10) || 0;
                        setQuickUsages(updated);
                      }}
                      className="w-16 bg-bg-card border border-white/10 rounded-lg px-2 py-1 text-center text-xs text-text-main font-bold outline-none focus:border-brand-accent"
                    />
                    <span className="text-[10px] text-text-muted font-bold">min</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsQuickRegisterOpen(false)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-text-muted font-semibold rounded-xl text-xs transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveQuickRegister}
                className="flex-1 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-bg-main font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Salvar Todos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};