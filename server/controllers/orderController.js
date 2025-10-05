const db = require('../config/database');

// 새 주문 생성
const createOrder = async (req, res) => {
  try {
    const { items, total_amount } = req.body;
    
    // 입력값 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: '주문 항목이 필요합니다.'
      });
    }
    
    if (!total_amount || total_amount <= 0) {
      return res.status(400).json({
        success: false,
        message: '유효한 총 금액이 필요합니다.'
      });
    }
    
    // 트랜잭션 시작
    await db.query('BEGIN');
    
    try {
      // 주문 아이템 검증 및 재고 확인
      for (const item of items) {
        const { menu_id, quantity } = item;
        
        // 메뉴 존재 여부 확인
        const menuResult = await db.query('SELECT * FROM menus WHERE id = $1', [menu_id]);
        if (menuResult.rows.length === 0) {
          throw new Error(`메뉴 ID ${menu_id}를 찾을 수 없습니다.`);
        }
        
        const menu = menuResult.rows[0];
        
        // 재고 확인
        if (menu.stock_quantity < quantity) {
          throw new Error(`${menu.name}의 재고가 부족합니다. (현재 재고: ${menu.stock_quantity}개)`);
        }
        
        // 재고 차감
        await db.query(
          'UPDATE menus SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [quantity, menu_id]
        );
      }
      
      // 주문 생성
      const orderItems = {
        items: items.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          options: item.options || [],
          item_price: item.item_price
        }))
      };
      
      const orderQuery = `
        INSERT INTO orders (order_items, total_amount, status)
        VALUES ($1, $2, 'ORDER_RECEIVED')
        RETURNING *;
      `;
      
      const orderResult = await db.query(orderQuery, [
        JSON.stringify(orderItems),
        total_amount
      ]);
      
      // 트랜잭션 커밋
      await db.query('COMMIT');
      
      res.status(201).json({
        success: true,
        message: '주문이 성공적으로 생성되었습니다.',
        data: {
          order_id: orderResult.rows[0].id,
          total_amount: orderResult.rows[0].total_amount,
          status: orderResult.rows[0].status
        }
      });
      
    } catch (error) {
      // 트랜잭션 롤백
      await db.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('주문 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: error.message || '주문 생성에 실패했습니다.'
    });
  }
};

// 모든 주문 목록 조회 (관리자용)
const getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        order_datetime,
        order_items,
        total_amount,
        status,
        created_at,
        updated_at
      FROM orders 
      ORDER BY order_datetime DESC;
    `;
    
    const result = await db.query(query);
    
    // 주문 아이템을 파싱하여 더 읽기 쉬운 형태로 변환
    const orders = result.rows.map(order => {
      try {
        const orderItems = JSON.parse(order.order_items);
        const itemsSummary = orderItems.items ? 
          orderItems.items.map(item => 
            `메뉴 ID ${item.menu_id} x ${item.quantity}`
          ).join(', ') : 
          '주문 항목 없음';
        
        return {
          id: order.id,
          order_datetime: order.order_datetime,
          items_summary: itemsSummary,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          updated_at: order.updated_at
        };
      } catch (parseError) {
        console.error('주문 아이템 파싱 오류:', parseError);
        return {
          id: order.id,
          order_datetime: order.order_datetime,
          items_summary: '파싱 오류',
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          updated_at: order.updated_at
        };
      }
    });
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 목록을 가져오는데 실패했습니다.'
    });
  }
};

// 특정 주문 상세 정보 조회
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }
    
    const order = result.rows[0];
    order.order_items = JSON.parse(order.order_items);
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('주문 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 정보를 가져오는데 실패했습니다.'
    });
  }
};

// 주문 상태 변경 (관리자용)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 유효한 상태값 검증
    const validStatuses = ['ORDER_RECEIVED', 'MAKING', 'COMPLETED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '유효한 주문 상태를 입력해주세요. (ORDER_RECEIVED, MAKING, COMPLETED)'
      });
    }
    
    // 주문 존재 여부 확인
    const orderCheck = await db.query('SELECT id, status FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }
    
    const currentStatus = orderCheck.rows[0].status;
    
    // 상태 변경 규칙 검증 (순차적 변경)
    const statusFlow = {
      'ORDER_RECEIVED': ['MAKING'],
      'MAKING': ['COMPLETED'],
      'COMPLETED': [] // 완료 상태에서는 변경 불가
    };
    
    if (!statusFlow[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `현재 상태(${currentStatus})에서 ${status}로 변경할 수 없습니다.`
      });
    }
    
    // 상태 업데이트
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *;
    `;
    
    const result = await db.query(query, [status, id]);
    
    res.json({
      success: true,
      message: '주문 상태가 업데이트되었습니다.',
      data: {
        id: result.rows[0].id,
        status: result.rows[0].status,
        updated_at: result.rows[0].updated_at
      }
    });
    
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 상태 업데이트에 실패했습니다.'
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};
