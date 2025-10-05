import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ stats }) => {
  const dashboardItems = [
    {
      id: 'total',
      title: '전체 주문',
      value: stats.total_orders,
      description: '전체 주문 건수'
    },
    {
      id: 'received',
      title: '접수 대기',
      value: stats.orders_received,
      description: '접수 대기 중인 주문 수'
    },
    {
      id: 'manufacturing',
      title: '제조 중',
      value: stats.orders_making,
      description: '현재 제조 중인 주문 수'
    },
    {
      id: 'completed',
      title: '제조 완료',
      value: stats.orders_completed,
      description: '제조 완료된 주문 수'
    }
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">대시보드</h2>
      <div className="dashboard-grid">
        {dashboardItems.map(item => (
          <div key={item.id} className="dashboard-card">
            <div className="card-content">
              <div className="card-title">{item.title}</div>
              <div className="card-value">{item.value}</div>
              <div className="card-description">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
