import React, { useState } from 'react';
import {
  Target,
  Plus,
  Clock,
  Edit3,
  Trash2,
  CheckCircle2,
  Calendar,
  X,
  Layers,
  Sparkles,
  AlertTriangle,
  Moon,
  TrendingDown
} from 'lucide-react';
import { useGoals } from '@/contexto/GoalsContext';

export const Goals: React.FC = () => {
  // 1. Dados e funções do Contexto (Firestore)
  const {
    generalGoalMinutes,
    appGoals,
    loading,
    updateGeneralGoal,
    addAppGoal,
    deleteAppGoal
  } = useGoals();

  // Modais
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isGeneralGoalModalOpen, setIsGeneralGoalModalOpen] = useState(false);

  // Formatação da Meta Geral
  const generalLimitHours = Math.floor(generalGoalMinutes / 60).toString().padStart(2, '0');
  const generalLimitMinutes = (generalGoalMinutes % 60).toString().padStart(2, '0');

  // Estados temporários para formulários
  const currentHours = Math.floor(generalGoalMinutes / 60).toString().padStart(2, '0');
  const currentMinutes = (generalGoalMinutes % 60).toString().padStart(2, '0');

  const [inputHours, setInputHours] = useState(currentHours);
  const [inputMinutes, setInputMinutes] = useState(currentMinutes);

  const [newAppName, setNewAppName] = useState('');
  const [newAppMinutes, setNewAppMinutes] = useState('30');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);

  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Funções de salvamento
  const handleSaveGeneralGoal = async () => {
    const hours = parseInt(inputHours, 10) || 0;
    const mins = parseInt(inputMinutes, 10) || 0;
    await updateGeneralGoal(hours, mins);
    setIsGeneralGoalModalOpen(false);
  };

  const handleAddAppGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName) return;

    await addAppGoal({
      appName: newAppName,
      dailyLimitMinutes: parseInt(newAppMinutes, 10) || 30,
      activeDays: selectedDays,
      active: true,
      currentUsageMinutes: 0 // Novo app inicia com 0 ou uso real do backend
    });

    setNewAppName('');
    setIsNewGoalModalOpen(false);
  };

  const handleDeleteGoal = async (id: string) => {
    await deleteAppGoal(id);
  };

  // Média diária geral atual (exemplo fixo do layout ou calculado das metas)
  const currentDailyAverageMinutes = 312; // 5h 12min
  const generalExcessMinutes = currentDailyAverageMinutes - generalGoalMinutes;
  const isGeneralOver = generalExcessMinutes > 0;

  // Progresso Semanal
  const weeklyTargetMinutes = generalGoalMinutes * 7;
  const weeklyCurrentMinutes = 1122; // 18h 42min
  const weeklyPercentage = Math.min(Math.round((weeklyCurrentMinutes / weeklyTargetMinutes) * 100), 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-text-muted">
        Carregando suas metas...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-text-main">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🎯</span> Painel de Metas
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Defina limites de uso para orientar o motor de Diagnóstico e Recomendações.
          </p>
        </div>

        <button
          onClick={() => setIsNewGoalModalOpen(true)}
          className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-bg-main font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Meta por App</span>
        </button>
      </div>

      {/* 1. Resumo Superior (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-bg-card rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase">Meta Diária Geral</p>
            <p className="text-xl font-extrabold mt-0.5">{generalLimitHours}h {generalLimitMinutes}min</p>
          </div>
        </div>

        <div className="p-4 bg-bg-card rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-white/5 text-text-main rounded-xl border border-white/10">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase">Metas por Apps</p>
            <p className="text-xl font-extrabold mt-0.5">{appGoals.length} configuradas</p>
          </div>
        </div>

        <div className="p-4 bg-bg-card rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-brand-success/10 text-brand-success rounded-xl border border-brand-success/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase">Índice de Cumprimento</p>
            <p className="text-xl font-extrabold text-brand-success mt-0.5">68% na semana</p>
          </div>
        </div>
      </div>

      {/* 2. Configuração de Meta Geral e Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Tempo Total Diário */}
        <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-accent" />
                Tempo Total Diário
              </span>
              <button 
                onClick={() => {
                  setInputHours(currentHours);
                  setInputMinutes(currentMinutes);
                  setIsGeneralGoalModalOpen(true);
                }}
                className="text-xs text-brand-accent hover:underline font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>

            <div className="bg-bg-main p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-text-muted">Meta configurada:</span>
                <span className="text-lg font-bold">{currentHours}h {currentMinutes}min</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-text-muted">Média diária atual:</span>
                <span className="text-lg font-bold text-brand-alert">
                  {Math.floor(currentDailyAverageMinutes / 60)}h {currentDailyAverageMinutes % 60}min
                </span>
              </div>
            </div>
          </div>

          {isGeneralOver && (
            <div className="p-3 rounded-xl bg-brand-alert/10 border border-brand-alert/20 text-brand-alert flex items-center gap-2 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Você está {Math.floor(generalExcessMinutes / 60) > 0 ? `${Math.floor(generalExcessMinutes / 60)}h ` : ''}
                {generalExcessMinutes % 60}min acima da sua meta geral diária.
              </span>
            </div>
          )}
        </section>

        {/* Card: Meta Semanal Acumulada */}
        <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-accent" />
                Meta Semanal Acumulada
              </span>
            </div>

            <div className="bg-bg-main p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Teto limite semanal:</span>
                <span className="font-bold">
                  {Math.floor(weeklyTargetMinutes / 60)}h {weeklyTargetMinutes % 60}min
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Progresso atual:</span>
                <span className="font-bold text-brand-accent">
                  {Math.floor(weeklyCurrentMinutes / 60)}h {weeklyCurrentMinutes % 60}min / {Math.floor(weeklyTargetMinutes / 60)}h
                </span>
              </div>

              {/* Barra de Progresso Semanal */}
              <div className="w-full bg-bg-card h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-accent rounded-full transition-all"
                  style={{ width: `${weeklyPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-text-muted">
            Média diária equivalente atual: <span className="font-bold text-text-main">3h 44min/dia</span>.
          </p>
        </section>
      </div>

      {/* 3. Lista de Metas por App */}
      <section className="space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span>📱</span> Metas por Aplicativo
        </h2>

        {appGoals.length === 0 ? (
          <div className="bg-bg-card p-8 rounded-2xl border border-white/5 text-center space-y-3">
            <div className="p-3 bg-white/5 w-fit mx-auto rounded-xl text-text-muted">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold">Você ainda não possui metas ativas</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Defina limites específicos para redes sociais e jogos para começar a receber análises no Diagnóstico.
            </p>
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="px-4 py-2 bg-brand-accent text-bg-main font-bold rounded-xl text-xs"
            >
              Criar primeira meta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appGoals.map(goal => {
              const currentUsage = goal.currentUsageMinutes || 0;
              const limit = goal.dailyLimitMinutes || 1;
              const isOver = currentUsage > limit;
              const excessMinutes = currentUsage - limit;
              const percentage = Math.min(Math.round((currentUsage / limit) * 100), 100);

              return (
                <div 
                  key={goal.id} 
                  className={`bg-bg-card p-5 rounded-2xl border space-y-4 flex flex-col justify-between transition-all ${
                    isOver ? 'border-brand-alert/40' : 'border-white/5'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold">{goal.appName}</h3>
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-text-muted hover:text-brand-alert p-1 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex justify-between text-text-muted">
                        <span>Meta:</span>
                        <span className="font-bold text-text-main">{limit} min/dia</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Uso Médio:</span>
                        <span className={`font-bold ${isOver ? 'text-brand-alert' : 'text-brand-success'}`}>
                          {currentUsage} min/dia
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isOver ? 'bg-brand-alert' : 'bg-brand-success'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-text-muted">{percentage}% do limite</span>
                        <span className={isOver ? 'text-brand-alert' : 'text-brand-success'}>
                          {isOver ? 'Acima da meta' : 'Dentro da meta'}
                        </span>
                      </div>
                    </div>

                    {/* Dias Ativos */}
                    <div className="flex items-center gap-1 pt-1">
                      {daysOfWeek.map(day => (
                        <span 
                          key={day}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            goal.activeDays?.includes(day)
                              ? 'bg-white/10 text-text-main'
                              : 'bg-transparent text-text-muted/30'
                          }`}
                        >
                          {day[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Alerta / Status de Excesso */}
                  <div className="pt-2 border-t border-white/5">
                    {isOver ? (
                      <div className="flex items-center gap-1 text-xs text-brand-alert font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>+{excessMinutes} min excesso</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-brand-success font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Dentro da meta</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Regras Especiais de Controle (Idêntico ao Card da Imagem) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span>🌙</span> Regras Especiais de Controle
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bg-main p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-accent font-bold text-xs uppercase tracking-wider mb-2">
                <Moon className="w-4 h-4" />
                <span>Controle Noturno</span>
              </div>
              <p className="text-xs text-text-muted">
                Evitar uso prolongado entre <span className="font-bold text-text-main">22:00</span> e <span className="font-bold text-text-main">06:00</span>.
              </p>
            </div>
            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-text-muted">Limite noturno:</span>
              <span className="font-bold text-text-main">30 minutos</span>
            </div>
          </div>

          <div className="bg-bg-main p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-success font-bold text-xs uppercase tracking-wider mb-2">
                <TrendingDown className="w-4 h-4" />
                <span>Meta de Redução Progressiva</span>
              </div>
              <p className="text-xs text-text-muted">
                Objetivo de corte: <span className="font-bold text-brand-success">-20%</span> nas próximas 4 semanas.
              </p>
            </div>
            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-text-muted">Meta Alvo:</span>
              <span className="font-bold text-text-main">4h 10min / dia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal 1: Adicionar Nova Meta por App */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddAppGoal}
            className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 relative shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsNewGoalModalOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-accent">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold">Nova Meta de Aplicativo</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-text-muted font-semibold mb-1.5">Nome do Aplicativo</label>
                <input
                  type="text"
                  placeholder="Ex: Instagram, TikTok, YouTube..."
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  required
                  className="w-full bg-bg-main border border-white/10 rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted font-semibold mb-1.5">Limite Diário (Minutos)</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={newAppMinutes}
                  onChange={(e) => setNewAppMinutes(e.target.value)}
                  className="w-full bg-bg-main border border-white/10 rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted font-semibold mb-2">Dias Ativos</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected 
                            ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' 
                            : 'bg-bg-main border-white/5 text-text-muted hover:bg-white/5'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsNewGoalModalOpen(false)}
                className="flex-1 py-2.5 bg-white/5 text-text-muted font-semibold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-brand-accent text-bg-main font-bold rounded-xl text-xs"
              >
                Criar Meta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Editar Meta Geral */}
      {isGeneralGoalModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsGeneralGoalModalOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold">Meta Diária de Tempo de Tela</h3>

            <div className="flex items-center gap-2 justify-center py-4">
              <div className="text-center">
                <input
                  type="number"
                  max="23"
                  min="0"
                  value={inputHours}
                  onChange={(e) => setInputHours(e.target.value.padStart(2, '0'))}
                  className="w-16 bg-bg-main border border-white/10 rounded-xl py-2 text-center text-xl font-bold text-text-main outline-none"
                />
                <span className="block text-[10px] text-text-muted font-bold mt-1">Horas</span>
              </div>
              <span className="text-xl font-bold text-text-muted mb-4">:</span>
              <div className="text-center">
                <input
                  type="number"
                  max="59"
                  min="0"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value.padStart(2, '0'))}
                  className="w-16 bg-bg-main border border-white/10 rounded-xl py-2 text-center text-xl font-bold text-text-main outline-none"
                />
                <span className="block text-[10px] text-text-muted font-bold mt-1">Minutos</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsGeneralGoalModalOpen(false)}
                className="flex-1 py-2.5 bg-white/5 text-text-muted font-semibold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGeneralGoal}
                className="flex-1 py-2.5 bg-brand-accent text-bg-main font-bold rounded-xl text-xs"
              >
                Salvar Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};