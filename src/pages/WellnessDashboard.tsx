import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, CheckCircle, Clock, Lightbulb, ShieldAlert, ArrowRight 
} from 'lucide-react';

// Dados simulados de uso semanal (em horas)
const initialWeeklyData = [
  { day: 'Seg', hours: 3.5, target: 3 },
  { day: 'Ter', hours: 4.2, target: 3 },
  { day: 'Qua', hours: 6.8, target: 3 }, // Pico
  { day: 'Qui', hours: 5.1, target: 3 },
  { day: 'Sex', hours: 7.5, target: 3 }, // Pico
  { day: 'Sáb', hours: 8.0, target: 4 }, // Fim de semana
  { day: 'Dom', hours: 4.0, target: 4 },
];

export const WellnessDashboard = () => {
  const [weeklyData] = useState(initialWeeklyData);

  // Cálculos de Diagnóstico
  const totalHours = weeklyData.reduce((acc, curr) => acc + curr.hours, 0);
  const avgHours = (totalHours / 7).toFixed(1);
  const targetHours = weeklyData.reduce((acc, curr) => acc + curr.target, 0);
  const deviancePercentage = Math.round(((totalHours - targetHours) / targetHours) * 100);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 md:p-10 space-y-8 font-sans">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Consultoria de <span className="text-[#FF5733]">Bem-Estar Digital</span>
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Análise comportamental do seu tempo de tela e plano de ação semanal.
          </p>
        </div>
        
        <button className="px-4 py-2.5 bg-[#FF5733] hover:bg-[#FF5733]/90 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-lg shadow-[#FF5733]/20 flex items-center justify-center gap-2 cursor-pointer">
          <Clock className="w-4 h-4" />
          <span>Registrar Tempo de Tela</span>
        </button>
      </div>

      {/* 📊 Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Horas Totais */}
        <div className="bg-[#1E2022] p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total na Semana</span>
            <Clock className="w-5 h-5 text-[#FF5733]" />
          </div>
          <div className="text-3xl font-black">{totalHours}h</div>
          <p className="text-xs text-[#9CA3AF]">Média diária: <strong className="text-white">{avgHours}h / dia</strong></p>
        </div>

        {/* Card 2: Desvio da Meta */}
        <div className="bg-[#1E2022] p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span className="text-xs font-semibold uppercase tracking-wider">Desvio de Meta</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-500">
            {deviancePercentage > 0 ? `+${deviancePercentage}%` : `${deviancePercentage}%`}
          </div>
          <p className="text-xs text-[#9CA3AF]">
            Você usou <strong className="text-white">{(totalHours - targetHours).toFixed(1)}h a mais</strong> que a meta planejada.
          </p>
        </div>

        {/* Card 3: Nível de Foco */}
        <div className="bg-[#1E2022] p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span className="text-xs font-semibold uppercase tracking-wider">Diagnóstico Geral</span>
            <TrendingUp className="w-5 h-5 text-[#FF5733]" />
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Atenção Moderada
          </div>
          <p className="text-xs text-[#9CA3AF]">Maior concentração de distrações na **Sexta** e **Sábado**.</p>
        </div>
      </div>

      {/* 📈 Seção Central: Gráficos e Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Uso de Tela */}
        <div className="lg:col-span-2 bg-[#1E2022] p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Picos de Consumo Semanal</h2>
            <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF5733]"></span> Uso Real</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2A2D32]"></span> Limite Recomendado</span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} unit="h" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2A2D32', borderRadius: '12px', borderColor: '#374151', color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours > 6 ? '#FF5733' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 💡 Recomendações Inteligentes e Ações */}
        <div className="bg-[#1E2022] p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#FF5733]">
              <Lightbulb className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Plano de Ação Inteligente</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#2A2D32]/50 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Picos de Sexta-feira
                </span>
                <p className="text-xs text-[#9CA3AF]">
                  Você atingiu **7.5h**. Configure o modo *"Sem distrações"* automaticamente às 18h.
                </p>
              </div>

              <div className="p-3 bg-[#2A2D32]/50 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Estabilidade na Segunda
                </span>
                <p className="text-xs text-[#9CA3AF]">
                  Parabéns! Na segunda-feira você ficou dentro da sua meta estipulada de **3h**.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-[#2A2D32] hover:bg-slate-700/80 text-white font-semibold text-xs rounded-xl transition-all border border-slate-700/50 flex items-center justify-center gap-2 group cursor-pointer">
            <span>Ver relatório completo de hábitos</span>
            <ArrowRight className="w-4 h-4 text-[#FF5733] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};