import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, ArrowLeft, Mail, AlertTriangle } from 'lucide-react';

type SectionType = 'terms' | 'privacy';

interface LegalProps {
  initialSection?: SectionType;
  onNavigateBack?: () => void;
}

export const Legal: React.FC<LegalProps> = ({ initialSection = 'terms', onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState<SectionType>(initialSection);

  // Sincroniza via URL se o usuário acessar com query params (ex: /terms?tab=privacy)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as SectionType;
    if (tabParam === 'terms' || tabParam === 'privacy') {
      setActiveTab(tabParam);
    }
  }, []);

  const handleTabChange = (tab: SectionType) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Botão de Voltar (se fornecido) */}
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a plataforma</span>
          </button>
        )}

        {/* 1. Cabeçalho Principal */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-brand-accent/10 rounded-2xl border border-brand-accent/20 mb-2">
            <ShieldCheck className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FocusFlow <span className="text-text-muted font-normal">| Transparência e Legal</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
            Consulte nossas diretrizes de utilização da plataforma e o nosso compromisso com a proteção dos seus dados pessoais.
          </p>
        </div>

        {/* 2. Seleção de Abas (Tabs) */}
        <div className="flex justify-center p-1 bg-bg-card border border-white/10 rounded-2xl max-w-md mx-auto">
          <button
            onClick={() => handleTabChange('terms')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'terms'
                ? 'bg-brand-accent text-bg-main shadow-md'
                : 'text-text-muted hover:text-text-main hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Termos de Uso</span>
          </button>

          <button
            onClick={() => handleTabChange('privacy')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'privacy'
                ? 'bg-brand-accent text-bg-main shadow-md'
                : 'text-text-muted hover:text-text-main hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Política de Privacidade</span>
          </button>
        </div>

        {/* 3. Área de Conteúdo */}
        <div className="bg-bg-card border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl text-xs sm:text-sm leading-relaxed text-text-muted space-y-8">
          
          {/* ================= SEÇÃO: TERMOS DE USO ================= */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-text-main">Termos de Uso</h2>
                <p className="text-xs text-text-muted">Última atualização: 11 de Agosto de 2026</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">1. Identificação e Finalidade do Serviço</h3>
                <p>
                  O <strong>FocusFlow</strong> é uma plataforma acadêmica de acompanhamento, análise e gestão do tempo de uso de dispositivos digitais. Seu objetivo é permitir que o usuário registre o tempo dedicado a diferentes aplicativos, estabeleça metas diárias e receba análises e conselhos educativos para promover a saúde digital.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">2. Aceitação dos Termos</h3>
                <p>
                  Ao criar uma conta ou utilizar qualquer funcionalidade do FocusFlow, o usuário declara ter lido, compreendido e concordado expressamente com estes Termos de Uso e com a nossa Política de Privacidade.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">3. Conta e Responsabilidades do Usuário</h3>
                <p>
                  O usuário é inteiramente responsável por manter a confidencialidade das credenciais da sua conta (e-mail e senha) e por todas as atividades realizadas a partir dela. O usuário compromete-se a fornecer dados verdadeiros no momento do cadastro.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">4. Inserção de Dados e Precisão</h3>
                <p>
                  O FocusFlow depende das informações inseridas de forma manual ou importadas pelo próprio usuário (como horas gastas em redes sociais, comunicação e navegação). A exatidão dos diagnósticos gerados é proporcional à precisão das informações informadas pelo usuário.
                </p>
              </section>

              {/* Destaque Acadêmico / Isenção Médica */}
              <section className="p-4 bg-brand-alert/10 border border-brand-alert/20 rounded-xl space-y-1 text-brand-alert">
                <div className="flex items-center gap-2 font-bold text-xs uppercase">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Caráter Informativo e Educativo</span>
                </div>
                <p className="text-xs">
                  As análises, gráficos, diagnósticos e recomendações apresentados pelo FocusFlow possuem finalidade estritamente informativa e pedagógica. <strong>Eles não constituem e não substituem diagnósticos médicos, psicológicos ou clínicos prestados por profissionais de saúde.</strong>
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">5. Propriedade Intelectual</h3>
                <p>
                  A marca FocusFlow, código-fonte, design, interfaces, gráficos e textos são de propriedade exclusiva dos desenvolvedores do projeto, respeitando bibliotecas e tecnologias de código aberto utilizadas na construção.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">6. Alterações nos Termos</h3>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações relevantes serão notificadas através da plataforma ou via e-mail cadastrado.
                </p>
              </section>
            </div>
          )}

          {/* ================= SEÇÃO: POLÍTICA DE PRIVACIDADE ================= */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-text-main">Política de Privacidade (LGPD)</h2>
                <p className="text-xs text-text-muted">Última atualização: 11 de Agosto de 2026</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">1. Quais dados coletamos</h3>
                <p>Para o funcionamento da plataforma, coletamos estritamente os dados necessários:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Dados de Cadastro:</strong> Nome, endereço de e-mail e UID de autenticação (Firebase Auth).</li>
                  <li><strong>Dados de Uso Digital:</strong> Nome dos aplicativos, tempo de permanência diário (em minutos), categoria e data.</li>
                  <li><strong>Metas e Configurações:</strong> Limites diários globais e limites por aplicativo definidos por você.</li>
                  <li><strong>Histórico Gerado:</strong> Diagnósticos, relatórios e evolução semanal armazenados na sua conta.</li>
                </ul>
              </section>

              <section className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <h4 className="font-bold text-text-main text-xs uppercase tracking-wider">❌ O que NUNCA coletamos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <span>• Conteúdo de mensagens</span>
                  <span>• Senhas de aplicativos</span>
                  <span>• Fotos ou Vídeos</span>
                  <span>• Histórico de navegação</span>
                  <span>• Dados bancários</span>
                  <span>• Localização (GPS)</span>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">2. Finalidade do Tratamento de Dados</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-text-main font-bold">
                        <th className="py-2">Dado</th>
                        <th className="py-2">Finalidade Principal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-2 font-semibold">E-mail / Nome</td>
                        <td className="py-2">Autenticação e identificação da sua conta.</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold">Tempo de uso registrado</td>
                        <td className="py-2">Gerar métricas, relatórios de consumo e diagnósticos.</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold">Metas cadastradas</td>
                        <td className="py-2">Calcular percentual de estouro de tempo e alertas.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">3. Armazenamento e Infraestrutura</h3>
                <p>
                  Os dados são armazenados na infraestrutura de nuvem do <strong>Google Firebase (Cloud Firestore & Authentication)</strong>, utilizando regras estritas de segurança que garantem que <strong>somente você possa ler e escrever seus próprios dados</strong> através da sua sessão autenticada.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">4. Direitos do Titular (LGPD)</h3>
                <p>Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Acessar os dados pessoais armazenados na plataforma;</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                  <li>Solicitar a <strong>exclusão definitiva da sua conta</strong> e de todo o seu histórico através da área de Configurações do sistema.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-text-main">5. Exclusão e Retenção de Dados</h3>
                <p>
                  Seus dados permanecem armazenados enquanto a sua conta estiver ativa. Ao solicitar a exclusão da conta em <i>Configurações {'>'} Excluir Conta</i>, todos os seus registros associados no banco de dados serão eliminados de forma irreversível.
                </p>
              </section>
            </div>
          )}

          {/* Rodapé Interno com Contato */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-accent" />
              <span>Dúvidas ou suporte: <strong>suporte@focusflow.com</strong></span>
            </div>
            <span>FocusFlow &copy; 2026 - Todos os direitos reservados.</span>
          </div>

        </div>
      </div>
    </div>
  );
};


