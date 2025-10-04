const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// 모든 메뉴 목록 조회
router.get('/', menuController.getAllMenus);

// 특정 메뉴 상세 정보 조회
router.get('/:id', menuController.getMenuById);

// 특정 메뉴의 옵션 목록 조회
router.get('/:id/options', menuController.getMenuOptions);

// 모든 메뉴의 재고 현황 조회 (관리자용)
router.get('/stock/all', menuController.getAllStock);

// 특정 메뉴의 재고 수량 수정 (관리자용)
router.put('/:id/stock', menuController.updateStock);

module.exports = router;
