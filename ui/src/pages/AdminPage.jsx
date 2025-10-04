import React, { useState } from 'react';
import { menuItems, initialInventory } from '../data/menuData';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import InventorySection from '../components/InventorySection';
import OrderStatusSection from '../components/OrderStatusSection';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [orders, setOrders] = useState([
    {
      id: 1,
      time: '14:23',
      items: '아메리카노 x 2, 카페 라떼 x 1',
      totalPrice: 14000,
      status: 'received'
    },
    {
      id: 2,
      time: '14:18',
      items: '카푸치노 x 1, 에스프레소 x 2',
      totalPrice: 12000,
      status: 'manufacturing'
    },
    {
      id: 3,
      time: '14:12',
      items: '바닐라 라떼 x 3',
      totalPrice: 16500,
      status: 'manufacturing'
    },
    {
      id: 4,
      time: '14:05',
      items: '아메리카노 x 1, 카페 모카 x 1',
      totalPrice: 10000,
      status: 'completed'
    },
    {
      id: 5,
      time: '13:58',
      items: '카페 라떼 x 2',
      totalPrice: 10000,
      status: 'completed'
    }
  ]);

  const updateInventory = (menuId, newQuantity) => {
    if (newQuantity < 0) return;
    
    setInventory(prev => ({
      ...prev,
      [menuId]: Math.max(0, newQuantity)
    }));
    
    // TODO: API 호출로 재고 업데이트
    console.log(`재고 업데이트: 메뉴 ID ${menuId} -> ${newQuantity}개`);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // TODO: API 호출로 주문 상태 업데이트
    console.log(`주문 상태 업데이트: 주문 ID ${orderId} -> ${newStatus}`);
  };

  const getDashboardStats = () => {
    const totalOrders = orders.length;
    const receivedOrders = orders.filter(order => order.status === 'received').length;
    const manufacturingOrders = orders.filter(order => order.status === 'manufacturing').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;

    return {
      totalOrders,
      receivedOrders,
      manufacturingOrders,
      completedOrders
    };
  };

  return (
    <div className="admin-page">
      <Header currentPage="admin" />
      <div className="admin-content">
        <Dashboard stats={getDashboardStats()} />
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
