import { createContext, useContext, useState, ReactNode } from 'react';
import { Report, ReportFilter } from '../types/Report';
import { getReports } from '../services/api';

interface ReportContextType {
  reports: Report[];
  loading: boolean;
  error: string | null;
  fetchReports: (filters?: ReportFilter) => Promise<void>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchReports = async (filters?: ReportFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReports(filters);
      setReports(data);
    } catch (error) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        error,
        fetchReports,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};