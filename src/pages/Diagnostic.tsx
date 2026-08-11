import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Diagnostic: React.FC = () => {
  const navigate = useNavigate();

  // Dados calculados / processados (virão da inteligência de dados + Firestore)
  const score = 72; // Regra: 80-100 (Excelente), 60-79 (Bom), 40-59 (Atenção), 0-39 (Crítico)
  
  const getScoreBadge = (val: number) => {
    if (val >= 80) return { label: 'Excelente', color: 'text-brand-success bg-brand-success/10 border-brand-success/30' };
    if (val >= 60) return { label: 'Bom', color: 'text-brand-accent bg-brand-accent/10 border-brand-accent/30' };
    if (val >= 40) return { label: 'Atenção', color: 'text-brand-alert bg-brand-alert/10 border-brand-alert/30' };
    return { label: 'Crítico', color: 'text-brand-alert bg-brand-alert/20 border-brand-alert/50' };
  };

  const badge = getScoreBadge(score);

  return (
    <div className="space-y-8 max-w-5xl pb-12 select-none">
      
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">🧠 Diagnóstico de Bem-Estar Digital</h1>
          <p className="text-sm text-text-muted mt-1">Análise inteligente da sua utilização na semana.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-bg-card border border-white/10 rounded-xl text-text-muted shrink-0">
          <Calendar className="w-4 h-4 text-brand-alert" />
          <span>Período: 03/08/2026 — 09/08/2026</span>
        </div>
      </div>

      {/* 1. 🧠 Resultado Geral (DiagnosticScore) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Índice de Bem-Estar</span>
          <p className="text-sm text-text-muted max-w-md">
            Seu uso está relativamente controlado, mas existem alguns pontos que merecem atenção para alcançar suas metas.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-bg-main p-4 rounded-2xl border border-white/5 shrink-0">
          <div className="text-center">
            <span className="text-4xl font-extrabold text-text-main">{score}</span>
            <span className="text-xs text-text-muted font-bold">/100</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <span className={`px-4 py-1.5 rounded-xl border text-sm font-bold ${badge.color}`}>
            {badge.label}
          </span>
        </div>
      </section>

      {/* 2. 📊 Resumo da Semana (DiagnosticSummary) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
          <span>📊</span> Resumo da Semana
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-bg-main rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted font-semibold uppercase">Tempo Médio</p>
              <p className="text-xl font-bold text-text-main mt-1">4h 32min</p>
              <p className="text-xs text-brand-alert font-medium mt-1">+32 min do limite</p>
            </div>
            <Clock className="w-6 h-6 text-brand-alert/80" />
          </div>

          <div className="p-4 bg-bg-main rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted font-semibold uppercase">Meta Diária</p>
              <p className="text-xl font-bold text-text-main mt-1">4h 00min</p>
              <p className="text-xs text-text-muted mt-1">Limite configurado</p>
            </div>
            <Target className="w-6 h-6 text-brand-accent/80" />
          </div>

          <div className="p-4 bg-bg-main rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted font-semibold uppercase">Dias na Meta</p>
              <p className="text-xl font-bold text-text-main mt-1">3 de 7 dias</p>
              <p className="text-xs text-brand-alert font-medium mt-1">4 dias acima do limite</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-brand-alert/80" />
          </div>
        </div>
      </section>

      {/* 3. ⚠️ Principais Pontos de Atenção & 4. 📈 Picos e Comportamento */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
          <span>⚠️</span> Principais Pontos de Atenção & Comportamento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card Instagram */}
          <div className="p-4 bg-bg-main rounded-xl border border-brand-alert/30 space-y-2">
            <div className="flex items-center gap-2 text-brand-alert font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-alert" />
              <span>Instagram Acima da Meta</span>
            </div>
            <p className="text-xs text-text-muted">
              Sua meta era <strong className="text-text-main">30 min/dia</strong>, mas sua média foi de <strong className="text-brand-alert">1h 02min/dia</strong> (+32 min).
            </p>
          </div>

          {/* Card Pico Quarta-feira */}
          <div className="p-4 bg-bg-main rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-brand-accent font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-brand-accent" />
              <span>Pico de Uso (Quarta-feira)</span>
            </div>
            <p className="text-xs text-text-muted">
              Quarta-feira registrou o maior pico da semana com <strong className="text-brand-accent">6h 18min</strong> de tela ativas.
            </p>
          </div>

          {/* Card Uso Noturno */}
          <div className="p-4 bg-bg-main rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-text-main font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-brand-alert" />
              <span>Uso Noturno Elevado</span>
            </div>
            <p className="text-xs text-text-muted">
              Houve concentração elevada de utilização no período noturno (entre 22h e 01h).
            </p>
          </div>
        </div>
      </section>

      {/* 5. 🔎 Análise Detalhada (DiagnosticAnalysis) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-3">
        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
          <span>💡</span> Análise Semanal
        </h2>
        <div className="p-4 bg-bg-main rounded-xl border border-white/5 text-sm text-text-muted leading-relaxed">
          Seu tempo médio de tela ficou <strong className="text-brand-alert">13% acima da meta</strong> definida para esta semana. O principal responsável pelo excesso foi o <strong className="text-text-main">Instagram</strong>, representando 42% do tempo total. Os picos ocorridos na Quarta-feira impactaram negativamente a sua métrica semanal.
        </div>
      </section>

      {/* 6. 💡 Resumo das Recomendações (RecommendationPreview) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-brand-alert/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-alert/10 text-brand-alert rounded-xl border border-brand-alert/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-main">3 Ações Sugeridas Encontradas</h3>
            <p className="text-xs text-text-muted mt-0.5">
              O sistema gerou recomendações personalizadas com base nos seus picos de uso.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/recommendations')}
          className="px-5 py-2.5 bg-brand-alert hover:bg-brand-alert/90 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shrink-0 shadow-sm"
        >
          <span>Ver Recomendações</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};