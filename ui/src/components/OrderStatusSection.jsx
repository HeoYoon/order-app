import React from 'react';
import '../styles/OrderStatusSection.css';

const OrderStatusSection = ({ orders, onUpdateOrderStatus }) => {
  const getStatusInfo = (status) => {
    const statusMap = {
      received: { label: '주문 접수', color: '#FFA500', nextStatus: 'manufacturing', nextLabel: '제조 중으로 변경' },
      manufacturing: { label: '제조 중', color: '#8A2BE2', nextStatus: 'completed', nextLabel: '제조 완료로 변경' },
      completed: { label: '제조 완료', color: '#90EE90', nextStatus: null, nextLabel: null }
    };
    return statusMap[status] || statusMap.received;
  };

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
  };

  const calculateTotalSales = () => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  return (
    <div className="order-status-section">
      <div className="section-header">
        <h2 className="section-title">주문 현황</h2>
        <div className="total-sales">
          총매출: <span className="sales-amount">{calculateTotalSales().toLocaleString()}원</span>
        </div>
      </div>
      <div className="orders-table">
        <div className="table-header">
          <div className="header-cell">시간</div>
          <div className="header-cell">상품명</div>
          <div className="header-cell">총 가격</div>
          <div className="header-cell">주문 상태</div>
          <div className="header-cell">액션</div>
        </div>
        
        <div className="table-body">
          {orders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="table-row">
                <div className="table-cell">{order.time}</div>
                <div className="table-cell">{order.items}</div>
                <div className="table-cell">{order.totalPrice.toLocaleString()}원</div>
                <div className="table-cell">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <div className="table-cell">
                  {statusInfo.nextStatus && (
                    <button
                      className="status-change-btn"
                      onClick={() => handleStatusChange(order.id, statusInfo.nextStatus)}
                    >
                      {statusInfo.nextLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusSection;
