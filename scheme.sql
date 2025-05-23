-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  image_url TEXT,
  reporter_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX reports_category_idx ON reports(category);
CREATE INDEX reports_created_at_idx ON reports(created_at);
CREATE INDEX reports_location_idx ON reports USING GIST(location);