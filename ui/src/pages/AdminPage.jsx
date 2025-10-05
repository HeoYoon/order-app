import React, { useState, useEffect } from 'react';
import { menuAPI, orderAPI, dashboardAPI } from '../utils/api';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import InventorySection from '../components/InventorySection';
import OrderStatusSection from '../components/OrderStatusSection';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState({});
  const [orders, setOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total_orders: 0,
    orders_received: 0,
    orders_making: 0,
    orders_completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 병렬로 모든 데이터 로드
        const [menusResponse, stockResponse, ordersResponse, statsResponse] = await Promise.all([
          menuAPI.getAllMenus(),
          menuAPI.getAllStock(),
          orderAPI.getAllOrders(),
          dashboardAPI.getStats()
        ]);

        console.log('API 응답들:', { menusResponse, stockResponse, ordersResponse, statsResponse });

        if (menusResponse.success) {
          setMenuItems(menusResponse.data);
        }

        if (stockResponse.success) {
          const stockMap = {};
          stockResponse.data.forEach(item => {
            stockMap[item.id] = item.stock_quantity;
          });
          setInventory(stockMap);
        }

        if (ordersResponse.success) {
          // 주문 데이터를 프런트엔드 형식으로 변환
          const formattedOrders = ordersResponse.data.map(order => ({
            id: order.id,
            time: new Date(order.order_datetime).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            items: order.items_summary,
            totalPrice: order.total_amount,
            status: order.status.toLowerCase().replace('_', '')
          }));
          setOrders(formattedOrders);
        }

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }

      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateInventory = async (menuId, newQuantity) => {
    if (newQuantity < 0) return;
    
    try {
      const response = await menuAPI.updateStock(menuId, newQuantity);
      
      if (response.success) {
        setInventory(prev => ({
          ...prev,
          [menuId]: newQuantity
        }));
        console.log(`재고 업데이트 완료: 메뉴 ID ${menuId} -> ${newQuantity}개`);
      } else {
        alert('재고 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('재고 업데이트 오류:', error);
      alert(`재고 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // API 상태 형식으로 변환 (MAKING, COMPLETED 등)
      const apiStatus = newStatus.toUpperCase().replace('RECEIVED', 'ORDER_RECEIVED');
      
      const response = await orderAPI.updateOrderStatus(orderId, apiStatus);
      
      if (response.success) {
        // 로컬 상태 업데이트
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // 대시보드 통계 새로고침
        const statsResponse = await dashboardAPI.getStats();
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }
        
        console.log(`주문 상태 업데이트 완료: 주문 ID ${orderId} -> ${newStatus}`);
      } else {
        alert('주문 상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error);
      alert(`주문 상태 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Header currentPage="admin" />
        <div className="loading-container">
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <Header currentPage="admin" />
        <div className="error-container">
          <p>오류: {error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Header currentPage="admin" />
      <div className="admin-content">
        <Dashboard stats={dashboardStats} />
        <InventorySection 
          menuItems={menuItems}
          inventory={inventory}
          onUpdateInventory={updateInventory}
        />
        <OrderStatusSection 
          orders={orders}
          onUpdateOrderStatus={updateOrderStatus}
        />
      </div>
    </div>
  );
};

export default AdminPage;
