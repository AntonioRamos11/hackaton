import { Router } from 'express';
import { createReportHandler, getReportsHandler } from '../controllers/reportController';

const router = Router();

router.post('/', createReportHandler);
router.get('/', getReportsHandler);

export default router;

