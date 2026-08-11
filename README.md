# 🎯 FocusFlow — Plataforma de Consultoria, Diagnóstico & Gestão de Bem-Estar Digital

O **FocusFlow** é uma solução web desenvolvida para atuar como uma **Plataforma de Consultoria e Diagnóstico de Bem-Estar Digital**.

> **Nota Conceitual:** O FocusFlow não realiza o monitoramento direto do dispositivo. Ele atua como uma plataforma de **consolidação, análise e diagnóstico**, utilizando como fonte de dados as métricas fornecidas pelas ferramentas nativas de uso de tela dos próprios sistemas operacionais.

---

## 👨‍💻 Desenvolvedor

* **Quizito Cristiano** — *Idealização, Arquitetura e Desenvolvimento do Projeto FocusFlow*

---

## 🏗️ Arquitetura Funcional & Fontes de Dados

O FocusFlow **não necessita de acesso a APIs sensíveis** dos dispositivos, mantendo total conformidade com a LGPD e reduzindo barreiras de privacidade. O sistema consolida as métricas vindas das três principais soluções do mercado:

```text
 Samsung Bem-estar Digital ──┐
                             │
 Apple Tempo de Uso ─────────┼──→ [ FOCUSFLOW ] ──→ Diagnóstico
                             │                      ↓
 StayFree / ActionDash ──────┘                 Recomendações
                                                    ↓
                                                Histórico



## 📌 Regras de Negócio & Metas de Uso

O usuário configura suas metas no FocusFlow em **três níveis principais**:

1. **Meta Geral Diária:** Limite global de tempo de uso do dispositivo (ex: no máximo 4h/dia).
2. **Metas Individuais por Aplicativo:** Limites específicos por categoria ou app (ex: Instagram: 30 min, WhatsApp: 1h, TikTok: 20 min).
3. **Horário de Maior Atenção (Janela de Descanso):** Definição de intervalos críticos em que o uso deve ser evitado ou reduzido (ex: entre 22:00 e 06:00).

---

## 📱 Estrutura das 9 Telas da Aplicação

1. **Dashboard:** Visão geral com média diária, progresso em relação à meta e destaque dos apps mais utilizados.
2. **Definir Minhas Metas:** Painel para estipular metas globais e individuais por aplicativo.
3. **Configurar Horários:** Definição da janela de atenção/descanso (ex: 22h às 06h).
4. **Registrar Meu Uso:** Formulário para entrada de dados diários com seleção da fonte (*Samsung*, *Apple* ou *StayFree/ActionDash*).
5. **Conferência dos Dados:** Etapa de validação dos valores antes do salvamento definitivo no banco.
6. **Relatório / Análise:** Gráficos interativos com histórico diário, identificação de dias de pico e comparações.
7. **Motor de Diagnóstico:** Análise inteligente de padrões de uso (ex: uso excessivo noturno, extrapolação de metas).
8. **Recomendações Ativas:** Sugestões graduais e personalizadas para reeducação e mudança de hábitos digitais.
9. **Ajustes & Perfil (LGPD):** Gestão de perfil com upload de foto via galeria/câmera, preferências da conta e e-mail mascarado para garantir privacidade.

---

## 📊 Benchmark de Mercado

| Ferramenta | Ecossistema | Pontos Fortes & Limitações |
| :--- | :--- | :--- |
| **Samsung Bem-Estar Digital** | Android (Nativo) | Gráficos visuais detalhados; restrito a aparelhos Samsung. |
| **Apple Tempo de Uso** | iOS / macOS (Nativo) | Controle parental e bloqueios rígidos; restrito ao ecossistema Apple. |
| **StayFree / ActionDash** | Android / iOS | Alertas em tempo real; exige permissões elevadas de acessibilidade no aparelho. |
| **FocusFlow** | Web / Universal | **Consultoria e Diagnóstico ativo**, metas por horário, visão agnóstica de sistema e total conformidade com privacidade (LGPD). |

---

## 📌 Requisitos do Sistema

### Requisitos Funcionais (RF)
* **RF01 — Consolidação de Uso:** Registro diário/semanal dos tempos de uso informados pelo usuário.
* **RF02 — Definição de Metas:** Estipulação de metas globais, limites por app e janelas de horário.
* **RF03 — Dashboard & Gráficos:** Visualização gráfica de consumo, picos de uso e relatórios comparativos.
* **RF04 — Motor de Diagnóstico:** Geração de diagnósticos automáticos e recomendações de hábitos.
* **RF05 — Histórico de Evolução:** Persistência do histórico para acompanhar o progresso de bem-estar digital.

### Requisitos Não Funcionais (RNF)
* **RNF01 — Conformidade LGPD:** Mascaramento de dados sensíveis e armazenamento restrito ao perfil autenticado.
* **RNF02 — Desempenho:** Aplicação desenvolvida em React/Vite com carregamento rápido e otimizado no lado do cliente.
* **RNF03 — Interface Responsiva:** Layout totalmente adaptável para dispositivos móveis e desktop.
* **RNF04 — Infraestrutura Serverless:** Utilização da camada gratuita do Firebase (Authentication, Firestore e Storage).

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React JS, TypeScript, Tailwind CSS, Vite
* **Backend / BaaS:** Firebase Auth, Cloud Firestore, Firebase Storage
* **Ícones & Interface:** Lucide React
* **Deploy & Hospedagem:** Vercel

---

## 🚀 Como Executar o Projeto Localmente

```bash
# 1. Clonar o repositório
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)

# 2. Entrar na pasta do projeto
cd focusflow

# 3. Instalar as dependências
npm install

# 4. Executar a aplicação
npm run dev