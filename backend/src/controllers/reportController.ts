import { Request, Response } from 'express';
import { Report, ReportFilter, createReport, getReports } from '../models/Report';
import { createReporterHash } from '../utils/security';

// Create a new report
export const createReportHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, description, latitude, longitude, image_url } = req.body;
    
    // Validate required fields
    if (!category || !description || !latitude || !longitude) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Generate anonymous hash for reporter
    const ip = req.ip || 'unknown';
    const reporterHash = createReporterHash(ip);
    
    // Create the report object
    const report = {
      category,
      description,
      latitude,
      longitude,
      image_url,
      reporter_hash: reporterHash
    };
    
    // Save to database
    const newReport = await createReport(report);
    
    res.status(201).json({ 
      success: true, 
      message: 'Report created successfully',
      data: newReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

// Get reports with optional filtering
export const getReportsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: ReportFilter = {
      category: req.query.category as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
      longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
      radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
    };
    
    const reports = await getReports(filters);
    
    res.status(200).json({ 
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};