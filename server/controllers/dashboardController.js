const db = require('../config/database');

// 대시보드 통계 정보 조회
const getDashboardStats = async (req, res) => {
  try {
    // 전체 주문 수
    const totalOrdersResult = await db.query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(totalOrdersResult.rows[0].count);
    
    // 상태별 주문 수
    const statusStatsResult = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM orders 
      GROUP BY status;
    `);
    
    // 상태별 주문 수를 객체로 변환
    const statusStats = statusStatsResult.rows.reduce((acc, row) => {
      acc[row.status.toLowerCase().replace('_', '_')] = parseInt(row.count);
      return acc;
    }, {});
    
    // 기본값 설정 (해당 상태의 주문이 없는 경우)
    const stats = {
      total_orders: totalOrders,
      orders_received: statusStats.order_received || 0,
      orders_making: statusStats.making || 0,
      orders_completed: statusStats.completed || 0
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '대시보드 통계를 가져오는데 실패했습니다.'
    });
  }
};

module.exports = {
  getDashboardStats
};
