import axios from 'axios';
import { Report, ReportFilter, ReportSubmission } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getReports = async (filters?: ReportFilter): Promise<Report[]> => {
  try {
    const response = await api.get('/reportes', { params: filters });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const submitReport = async (report: ReportSubmission): Promise<Report> => {
  try {
    const response = await api.post('/reportes', report);
    return response.data.data;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};