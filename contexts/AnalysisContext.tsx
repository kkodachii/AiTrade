import { ChartAnalysis } from '@/services/aiService';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AnalysisContextType {
  analysis: ChartAnalysis | null;
  setAnalysis: (analysis: ChartAnalysis | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<ChartAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis, isLoading, setIsLoading }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
