export interface Report {
  id?: number;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  reporter_hash?: string;
  created_at?: string;
}

export interface ReportFilter {
  category?: string;
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface ReportSubmission {
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}