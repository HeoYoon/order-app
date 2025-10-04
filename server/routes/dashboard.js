const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// 대시보드 통계 정보 조회
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
