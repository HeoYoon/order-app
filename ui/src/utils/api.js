// API 클라이언트 유틸리티

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// 기본 API 요청 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    console.log('API 요청:', { url, config });
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API 응답 오류:', { status: response.status, statusText: response.statusText, errorData });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API 응답 성공:', result);
    return result;
  } catch (error) {
    console.error('API 요청 오류:', { url, error: error.message });
    throw error;
  }
};

// 메뉴 관련 API
export const menuAPI = {
  // 모든 메뉴 목록 조회
  getAllMenus: () => apiRequest('/api/menus'),
  
  // 특정 메뉴 상세 정보 조회
  getMenuById: (id) => apiRequest(`/api/menus/${id}`),
  
  // 특정 메뉴의 옵션 목록 조회
  getMenuOptions: (id) => apiRequest(`/api/menus/${id}/options`),
  
  // 모든 메뉴의 재고 현황 조회 (관리자용)
  getAllStock: () => apiRequest('/api/menus/stock/all'),
  
  // 특정 메뉴의 재고 수량 수정 (관리자용)
  updateStock: (id, stockQuantity) => 
    apiRequest(`/api/menus/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock_quantity: stockQuantity })
    })
};

// 주문 관련 API
export const orderAPI = {
  // 새 주문 생성
  createOrder: (orderData) => 
    apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
  
  // 모든 주문 목록 조회 (관리자용)
  getAllOrders: () => apiRequest('/api/orders'),
  
  // 특정 주문 상세 정보 조회
  getOrderById: (id) => apiRequest(`/api/orders/${id}`),
  
  // 주문 상태 변경 (관리자용)
  updateOrderStatus: (id, status) => 
    apiRequest(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
};

// 대시보드 관련 API
export const dashboardAPI = {
  // 대시보드 통계 정보 조회
  getStats: () => apiRequest('/api/dashboard/stats')
};

export default {
  menuAPI,
  orderAPI,
  dashboardAPI
};
