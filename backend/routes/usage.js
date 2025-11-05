const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');

router.post('/log', usageController.logUsage);
router.get('/stats', usageController.getUsageStats);
router.get('/recent', usageController.getRecentLogs);

module.exports = router;