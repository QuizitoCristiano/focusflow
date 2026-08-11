import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/services/config';
import { useAuth } from '@/contexto/useAuth';
import type { ScreenTimeEntry } from '@/types/firestore';

interface ScreenTimeContextData {
  entries: ScreenTimeEntry[];
  loading: boolean;
  addScreenTimeEntry: (entry: Omit<ScreenTimeEntry, 'id' | 'createdAt'>) => Promise<void>;
  deleteScreenTimeEntry: (id: string) => Promise<void>;
  getEntriesByDate: (date: string) => ScreenTimeEntry[];
}

const ScreenTimeContext = createContext<ScreenTimeContextData>({} as ScreenTimeContextData);

export const ScreenTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ScreenTimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega todos os registros de uso do usuário
  useEffect(() => {
    async function loadScreenTimeData() {
      if (!user?.uid) {
        setEntries([]);
        setLoading(false);
        return;
      }

      try {
        const entriesRef = collection(db, 'users', user.uid, 'screenTime');
        const snap = await getDocs(entriesRef);
        
        const loadedEntries: ScreenTimeEntry[] = snap.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as ScreenTimeEntry[];

        setEntries(loadedEntries);
      } catch (error) {
        console.error('Erro ao carregar registros de tempo de uso:', error);
      } finally {
        setLoading(false);
      }
    }

    loadScreenTimeData();
  }, [user]);

  // Adiciona um novo registro de tempo de uso
  const addScreenTimeEntry = async (entryData: Omit<ScreenTimeEntry, 'id' | 'createdAt'>) => {
    if (!user?.uid) return;

    try {
      const entriesRef = collection(db, 'users', user.uid, 'screenTime');
      const docRef = await addDoc(entriesRef, {
        ...entryData,
        createdAt: serverTimestamp()
      });

      const newEntry: ScreenTimeEntry = {
        id: docRef.id,
        ...entryData,
        createdAt: new Date()
      };

      setEntries(prev => [...prev, newEntry]);
    } catch (error) {
      console.error('Erro ao salvar registro de tempo de uso:', error);
    }
  };

  // Remove um registro específico
  const deleteScreenTimeEntry = async (id: string) => {
    if (!user?.uid) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'screenTime', id));
      setEntries(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao remover registro:', error);
    }
  };

  // Helper para filtrar registros por uma data específica ("YYYY-MM-DD")
  const getEntriesByDate = (date: string) => {
    return entries.filter(entry => entry.date === date);
  };

  return (
    <ScreenTimeContext.Provider
      value={{
        entries,
        loading,
        addScreenTimeEntry,
        deleteScreenTimeEntry,
        getEntriesByDate
      }}
    >
      {children}
    </ScreenTimeContext.Provider>
  );
};

export const useScreenTime = () => {
  const context = useContext(ScreenTimeContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useScreenTime deve ser usado dentro de um ScreenTimeProvider');
  }
  return context;
};