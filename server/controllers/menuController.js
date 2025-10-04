const db = require('../config/database');

// 모든 메뉴 목록 조회
const getAllMenus = async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image_url,
        m.stock_quantity,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'price', o.price
            )
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'
        ) as options
      FROM menus m
      LEFT JOIN options o ON m.id = o.menu_id
      GROUP BY m.id, m.name, m.description, m.price, m.image_url, m.stock_quantity
      ORDER BY m.id;
    `;
    
    const result = await db.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('메뉴 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '메뉴 목록을 가져오는데 실패했습니다.'
    });
  }
};

// 특정 메뉴 상세 정보 조회
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 메뉴 정보 조회
    const menuQuery = 'SELECT * FROM menus WHERE id = $1';
    const menuResult = await db.query(menuQuery, [id]);
    
    if (menuResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    // 옵션 정보 조회
    const optionsQuery = 'SELECT * FROM options WHERE menu_id = $1 ORDER BY id';
    const optionsResult = await db.query(optionsQuery, [id]);
    
    const menu = {
      ...menuResult.rows[0],
      options: optionsResult.rows
    };
    
    res.json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('메뉴 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '메뉴 정보를 가져오는데 실패했습니다.'
    });
  }
};

// 특정 메뉴의 옵션 목록 조회
const getMenuOptions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM options WHERE menu_id = $1 ORDER BY id';
    const result = await db.query(query, [id]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('옵션 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '옵션 목록을 가져오는데 실패했습니다.'
    });
  }
};

// 모든 메뉴의 재고 현황 조회 (관리자용)
const getAllStock = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        name,
        stock_quantity,
        updated_at
      FROM menus 
      ORDER BY name;
    `;
    
    const result = await db.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('재고 현황 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '재고 현황을 가져오는데 실패했습니다.'
    });
  }
};

// 특정 메뉴의 재고 수량 수정 (관리자용)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    
    // 입력값 검증
    if (stock_quantity === undefined || stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: '유효한 재고 수량을 입력해주세요.'
      });
    }
    
    // 메뉴 존재 여부 확인
    const menuCheck = await db.query('SELECT id FROM menus WHERE id = $1', [id]);
    if (menuCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    // 재고 수량 업데이트
    const query = `
      UPDATE menus 
      SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *;
    `;
    
    const result = await db.query(query, [stock_quantity, id]);
    
    res.json({
      success: true,
      message: '재고 수량이 업데이트되었습니다.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('재고 수량 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '재고 수량 업데이트에 실패했습니다.'
    });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  getMenuOptions,
  getAllStock,
  updateStock
};
