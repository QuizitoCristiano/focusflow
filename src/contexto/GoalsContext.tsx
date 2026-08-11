import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/config';
import { useAuth } from '@/contexto/useAuth';

export interface AppGoal {
  id: string;
  appName: string;
  dailyLimitMinutes: number;
  currentUsageMinutes: number;
  activeDays: string[];
  active: boolean;
}

interface GoalsContextData {
  generalGoalMinutes: number;
  appGoals: AppGoal[];
  loading: boolean;
  updateGeneralGoal: (hours: number, minutes: number) => Promise<void>;
  addAppGoal: (newGoal: Omit<AppGoal, 'id' | 'currentUsageMinutes'>) => Promise<void>;
  deleteAppGoal: (id: string) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextData>({} as GoalsContextData);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [generalGoalMinutes, setGeneralGoalMinutes] = useState(240);
  const [appGoals, setAppGoals] = useState<AppGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper para obter a referência do documento sempre atualizada
  const getUserDocRef = () => {
    if (!user?.uid) return null;
    return doc(db, 'users', user.uid, 'metas', 'active');
  };

  // Carrega dados do Firestore ao iniciar ou quando o usuário mudar
  useEffect(() => {
    async function loadGoals() {
      const docRef = getUserDocRef();
      if (!docRef) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setGeneralGoalMinutes(data.dailyGoalMinutes ?? 240);
          setAppGoals(data.appLimits ?? []);
        }
      } catch (error) {
        console.error('Erro ao carregar metas do Firestore:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, [user]);

  // Atualiza a meta geral no Firestore
  const updateGeneralGoal = async (hours: number, minutes: number) => {
    const total = hours * 60 + minutes;
    setGeneralGoalMinutes(total);

    const docRef = getUserDocRef();
    if (!docRef) return;

    try {
      await setDoc(docRef, { 
        dailyGoalMinutes: total, 
        updatedAt: serverTimestamp() 
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar meta geral:', error);
    }
  };

  // Adiciona uma nova meta por app e persiste no Firestore
  const addAppGoal = async (goalData: Omit<AppGoal, 'id' | 'currentUsageMinutes'>) => {
    const newGoal: AppGoal = {
      ...goalData,
      id: Date.now().toString(),
      currentUsageMinutes: 0,
    };
    
    const updated = [...appGoals, newGoal];
    setAppGoals(updated);

    const docRef = getUserDocRef();
    if (!docRef) return;

    try {
      await setDoc(docRef, { 
        appLimits: updated, 
        updatedAt: serverTimestamp() 
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao adicionar meta de app:', error);
    }
  };

  // Remove uma meta por app e persiste no Firestore
  const deleteAppGoal = async (id: string) => {
    const updated = appGoals.filter((g) => g.id !== id);
    setAppGoals(updated);

    const docRef = getUserDocRef();
    if (!docRef) return;

    try {
      await setDoc(docRef, { 
        appLimits: updated, 
        updatedAt: serverTimestamp() 
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao deletar meta de app:', error);
    }
  };

  return (
    <GoalsContext.Provider
      value={{
        generalGoalMinutes,
        appGoals,
        loading,
        updateGeneralGoal,
        addAppGoal,
        deleteAppGoal,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);