const UsageLog = require('../models/UsageLog');

exports.logUsage = async (req, res) => {
  try {
    const log = await UsageLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUsageStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    const daysMap = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    
    const days = daysMap[period] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await UsageLog.find({
      timestamp: { $gte: startDate }
    });

    const stats = {
      totalActions: logs.length,
      clicks: logs.filter(l => l.action === 'click').length,
      scrolls: logs.filter(l => l.action === 'scroll').length,
      moves: logs.filter(l => l.action === 'move').length,
      connections: logs.filter(l => l.action === 'connect').length,
      totalDuration: logs.reduce((sum, l) => sum + (l.sessionDuration || 0), 0),
      dailyActivity: {}
    };

    logs.forEach(log => {
      const day = log.timestamp.toISOString().split('T')[0];
      stats.dailyActivity[day] = (stats.dailyActivity[day] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await UsageLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};