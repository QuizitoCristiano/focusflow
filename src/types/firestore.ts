import { FieldValue, Timestamp } from 'firebase/firestore';

// Base para datas aceitas no Firebase
export type FirestoreDate = FieldValue | Timestamp | Date | string;

// 1. Perfil do Usuário -> users/{userId}
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
}

// 2. Metas -> users/{userId}/metas/{metaId}
export interface AppLimit {
  appName: string;
  category: string;
  maxMinutes: number;
}

export interface Goal {
  id?: string;
  dailyGoalMinutes: number; // Ex: 240 (4h)
  period: 'Diário' | 'Semanal';
  appLimits: AppLimit[];
  activeDays?: string[]; // Ex: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  isActive: boolean;
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

// 3. Tempo de Uso Diário (Bruto) -> users/{userId}/screenTime/{screenTimeId}
export interface ScreenTimeEntry {
  id?: string;
  date: string; // "YYYY-MM-DD"
  appName: string;
  category: 'Redes Sociais' | 'Entretenimento' | 'Comunicação' | 'Navegação' | 'Trabalho' | 'Estudos' | 'Outro';
  minutes: number;
  source: 'Samsung Bem-Estar Digital' | 'Apple Tempo de Uso' | 'Outro Dispositivo' | 'Registro Manual';
  notes?: string;
  createdAt: FirestoreDate;
}

// 4. Diagnóstico Comportamental -> users/{userId}/diagnostics/{diagnosticId}
export interface Diagnostic {
  id?: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  summaryText: string;
  positivePoints: string[];
  attentionPoints: string[];
  riskLevel: 'baixo' | 'medio' | 'alto';
  createdAt: FirestoreDate;
}

// 5. Recomendações Sugeridas -> users/{userId}/recommendations/{recommendationId}
export interface Recommendation {
  id?: string;
  diagnosticId?: string;
  type: 'goal_exceeded' | 'app_overuse' | 'spike_detected' | 'negative_trend' | 'positive_trend';
  title: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  isRead: boolean;
  createdAt: FirestoreDate;
}

// 6. Relatório Consolidado -> users/{userId}/reports/{reportId}
export interface AppUsageDetail {
  appName: string;
  minutes: number;
  goalMinutes: number;
  exceededGoal: boolean;
}

export interface Report {
  id?: string;
  periodType: 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  totalMinutes: number;
  averageDailyMinutes: number;
  dailyGoalMinutes: number;
  goalCompletionPercentage: number;
  variationPercentage: number;
  topApp: string;
  topAppMinutes: number;
  peakDay: string;
  peakDayMinutes: number;
  lowestDay: string;
  lowestDayMinutes: number;
  appBreakdown: AppUsageDetail[];
  diagnosticId?: string;
  recommendationIds?: string[];
  createdAt: FirestoreDate;
}

// 7. Histórico Consolidado de Períodos -> users/{userId}/history/{historyId}
export interface HistoryRecord {
  id?: string;
  periodType: 'weekly';
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
  recommendationsSummary: string[];
  createdAt: FirestoreDate;
}