import { ChartAnalysis } from '@/services/aiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface HistoryItem {
  id: string;
  timestamp: number;
  analysis: ChartAnalysis;
  imageBase64: string;
  timeframe: string;
  indicators: string[];
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (analysis: ChartAnalysis, imageBase64: string, timeframe: string, indicators: string[]) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  isLoading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'trading_analysis_history';

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from storage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveHistory();
    }
  }, [history, isLoading]);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsedHistory = JSON.parse(stored);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const addToHistory = (analysis: ChartAnalysis, imageBase64: string, timeframe: string, indicators: string[]) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      analysis,
      imageBase64,
      timeframe,
      indicators,
    };
    
    setHistory(prev => [newItem, ...prev]);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ 
      history, 
      addToHistory, 
      removeFromHistory, 
      clearHistory, 
      isLoading 
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
