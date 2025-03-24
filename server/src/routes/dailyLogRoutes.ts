import express from 'express';
import {
  getAllDailyLogs,
  getDailyLogByDate,
  addFoodEntry,
  updateFoodEntry,
  deleteFoodEntry
} from '../controllers/dailyLogController';

const router = express.Router();

router.get('/', getAllDailyLogs);
router.get('/:date', getDailyLogByDate);
router.post('/:date/entries', addFoodEntry);
router.put('/:date/entries/:entryId', updateFoodEntry);
router.delete('/:date/entries/:entryId', deleteFoodEntry);

export default router;
