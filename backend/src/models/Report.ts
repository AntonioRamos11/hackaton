import pool from '../config/database';

export interface Report {
  id?: number;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  reporter_hash?: string;
  created_at?: Date;
}

export interface ReportFilter {
  category?: string;
  startDate?: string;
  endDate?: string;
  radius?: number;
  latitude?: number;
  longitude?: number;
}

export const createReport = async (report: Report): Promise<Report> => {
  const { category, description, latitude, longitude, image_url, reporter_hash } = report;
  
  const query = `
    INSERT INTO reports (category, description, location, image_url, reporter_hash, created_at)
    VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, NOW())
    RETURNING id, category, description, ST_X(location) as longitude, ST_Y(location) as latitude, 
              image_url, reporter_hash, created_at
  `;
  
  const values = [category, description, longitude, latitude, image_url, reporter_hash];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getReports = async (filters: ReportFilter = {}): Promise<Report[]> => {
  const conditions = [];
  const values: any[] = [];
  let valueIndex = 1;
  
  // Base query
  let query = `
    SELECT id, category, description, ST_X(location) as longitude, ST_Y(location) as latitude, 
           image_url, reporter_hash, created_at
    FROM reports
  `;
  
  // Add filter conditions
  if (filters.category) {
    conditions.push(`category = $${valueIndex++}`);
    values.push(filters.category);
  }
  
  if (filters.startDate) {
    conditions.push(`created_at >= $${valueIndex++}`);
    values.push(filters.startDate);
  }
  
  if (filters.endDate) {
    conditions.push(`created_at <= $${valueIndex++}`);
    values.push(filters.endDate);
  }
  
  // Geographical filtering using PostGIS
  if (filters.latitude && filters.longitude && filters.radius) {
    conditions.push(`ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint($${valueIndex++}, $${valueIndex++}), 4326),
      $${valueIndex++} * 0.0009090
    )`); // Convert kilometers to approximate degrees
    values.push(filters.longitude, filters.latitude, filters.radius);
  }
  
  // Add WHERE clause if there are conditions
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  // Add order by newest first
  query += ` ORDER BY created_at DESC`;
  
  const result = await pool.query(query, values);
  return result.rows;
};