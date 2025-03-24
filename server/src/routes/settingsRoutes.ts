import express from 'express';
import {
  getAppSettings,
  updateSettings,
  resetSettings
} from '../controllers/settingsController';

const router = express.Router();

router.get('/', getAppSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);

export default router;
