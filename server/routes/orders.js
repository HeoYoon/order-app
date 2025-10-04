const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 새 주문 생성
router.post('/', orderController.createOrder);

// 모든 주문 목록 조회 (관리자용)
router.get('/', orderController.getAllOrders);

// 특정 주문 상세 정보 조회
router.get('/:id', orderController.getOrderById);

// 주문 상태 변경 (관리자용)
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
