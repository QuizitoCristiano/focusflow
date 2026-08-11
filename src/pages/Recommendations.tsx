import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  HelpCircle, 

  Moon, 
  CheckCircle2, 
  Calendar, 
  X,
  Target,
  Flame,
  ChevronDown
} from 'lucide-react';

interface RecommendationReason {
  title: string;
  target: string;
  current: string;
  difference: string;
  explanation: string;
}

export const Recommendations: React.FC = () => {
  const navigate = useNavigate();

  // Estado para controlar o modal "Por que recebi esta recomendação?"
  const [activeReason, setActiveReason] = useState<RecommendationReason | null>(null);

  return (
    <div className="space-y-8 max-w-5xl pb-12 select-none">
      
      {/* 1. Header com seletor de período */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">💡 Recomendações Personalizadas</h1>
          <p className="text-sm text-text-muted mt-1">Pequenas mudanças baseadas na sua última análise de uso.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-bg-card border border-white/10 rounded-xl text-text-muted">
            <Calendar className="w-4 h-4 text-brand-alert" />
            <span>04 Aug — 10 Aug</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </div>
        </div>
      </div>

      {/* 2. Resumo do Diagnóstico (Por que estou vendo isso?) */}
      <section className="bg-bg-card p-6 rounded-2xl border border-brand-alert/30 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-brand-alert text-xs font-bold uppercase tracking-wider">
          <Moon className="w-4 h-4" />
          <span>Seu Principal Ponto de Atenção</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text-main">🌙 Uso excessivo durante a noite</h2>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              Você utilizou o celular por <strong className="text-text-main">2h 18min</strong> entre 22h e 00h nesta semana. Isso representa um aumento de <strong className="text-brand-alert">+34%</strong> em relação à semana anterior.
            </p>
          </div>
          <button 
            onClick={() => navigate('/diagnostic')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-text-main transition-all shrink-0"
          >
            Ver Diagnóstico Completo →
          </button>
        </div>
      </section>

      {/* 3. Recomendações Prioritárias */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
          <span>🔴</span> Ações Prioritárias
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Alta Prioridade - Reduzir Instagram */}
          <div className="bg-bg-card p-5 rounded-2xl border border-brand-alert/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-alert/15 text-brand-alert border border-brand-alert/30">
                  Alta Prioridade
                </span>
                <span className="text-xs text-text-muted">Instagram</span>
              </div>
              <h3 className="text-base font-bold text-text-main">Reduzir limite do Instagram em 15 min/dia</h3>
              <p className="text-xs text-text-muted">
                Meta atual: <strong className="text-text-main">30min</strong> | Média na semana: <strong className="text-brand-alert">1h 12min</strong> (+42 min acima).
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setActiveReason({
                  title: 'Redução do Instagram',
                  target: '30 minutos por dia',
                  current: '1h 12min por dia',
                  difference: '42 minutos acima da meta',
                  explanation: 'Identificamos que o Instagram representa o maior desvio no seu tempo de tela diário. Uma redução gradual de 15 min facilitará o cumprimento da sua meta geral sem mudanças bruscas.'
                })}
                className="flex-1 px-3 py-2 bg-bg-main hover:bg-white/5 border border-white/5 rounded-xl text-xs font-semibold text-text-muted hover:text-text-main transition-all flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-brand-accent" />
                <span>Por que recebi?</span>
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="flex-1 px-3 py-2 bg-brand-alert hover:bg-brand-alert/90 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Aplicar como meta</span>
              </button>
            </div>
          </div>

          {/* Card 2: Média Prioridade - Uso Noturno */}
          <div className="bg-bg-card p-5 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-accent/15 text-brand-accent border border-brand-accent/30">
                  Média Prioridade
                </span>
                <span className="text-xs text-text-muted">Período Noturno</span>
              </div>
              <h3 className="text-base font-bold text-text-main">Ativar pausa de telas após as 22h</h3>
              <p className="text-xs text-text-muted">
                O uso no período das 22h às 00h representou <strong className="text-brand-accent">31%</strong> de todo o seu uso diário.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setActiveReason({
                  title: 'Ajuste de Uso Noturno',
                  target: 'Período livre de telas das 22h às 00h',
                  current: '2h 18min de uso noturno',
                  difference: '+34% do que na semana passada',
                  explanation: 'A utilização tardia de dispositivos impacta diretamente o sono e o foco do dia seguinte. O motor de regras sinalizou esse pico como um fator crítico de atenção.'
                })}
                className="flex-1 px-3 py-2 bg-bg-main hover:bg-white/5 border border-white/5 rounded-xl text-xs font-semibold text-text-muted hover:text-text-main transition-all flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-brand-accent" />
                <span>Por que recebi?</span>
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-text-main font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
              >
                <span>Configurar limite</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. 🟢 Seus Pontos Positivos */}
      <section className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
          <span>🟢</span> Seus Pontos Positivos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-bg-main rounded-xl border border-white/5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text-main">TikTok reduziu 28%</p>
              <p className="text-xs text-text-muted mt-0.5">Você diminuiu o uso do TikTok em relação à semana passada. Excelente avanço!</p>
            </div>
          </div>

          <div className="p-4 bg-bg-main rounded-xl border border-white/5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text-main">Meta alcançada no YouTube</p>
              <p className="text-xs text-text-muted mt-0.5">Você cumpriu o limite definido para vídeos em 6 de 7 dias da semana.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 🎯 Plano para a Próxima Semana */}
      <section className="bg-bg-card p-6 rounded-2xl border border-brand-accent/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-brand-accent text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Seu Objetivo para a Próxima Semana</span>
          </div>
          <h2 className="text-xl font-bold text-text-main">Reduzir o tempo médio diário para 3h 30min</h2>
          <p className="text-xs text-text-muted max-w-lg">
            Redução gradativa estimada de 20%. Aplicativos prioritários para corte: <strong className="text-text-main">Instagram (45 min)</strong> e <strong className="text-text-main">TikTok (30 min)</strong>.
          </p>
        </div>

        <button 
          onClick={() => alert('Plano da semana ativado com sucesso!')}
          className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-bg-main font-bold rounded-xl text-sm transition-all shadow-sm shrink-0 flex items-center gap-2"
        >
          <Flame className="w-4 h-4 fill-bg-main" />
          <span>Ativar Plano da Semana</span>
        </button>
      </section>

      {/* Modal: "Por que recebi esta recomendação?" */}
      {activeReason && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setActiveReason(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-accent">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold text-text-main">Explicação do Sistema</h3>
            </div>

            <div className="space-y-3 bg-bg-main p-4 rounded-xl border border-white/5 text-xs">
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-text-muted font-semibold">Meta Configurada:</span>
                <span className="text-text-main font-bold">{activeReason.target}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-text-muted font-semibold">Média Registrada:</span>
                <span className="text-brand-alert font-bold">{activeReason.current}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-semibold">Diferença Identificada:</span>
                <span className="text-brand-alert font-bold">{activeReason.difference}</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              {activeReason.explanation}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveReason(null)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs transition-all"
              >
                Entendi
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};