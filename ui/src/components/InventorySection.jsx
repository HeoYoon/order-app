import React from 'react';
import '../styles/InventorySection.css';

const InventorySection = ({ menuItems, inventory, onUpdateInventory }) => {
  const handleQuantityChange = (menuId, newQuantity) => {
    if (newQuantity < 0) return;
    onUpdateInventory(menuId, newQuantity);
  };

  const handleQuantityInput = (menuId, value) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      onUpdateInventory(menuId, quantity);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { text: '품절', className: 'stock-out' };
    } else if (quantity < 5) {
      return { text: '주의', className: 'stock-warning' };
    } else {
      return { text: '정상', className: 'stock-normal' };
    }
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">재고 현황</h2>
      <div className="inventory-grid">
        {menuItems.map(menuItem => {
          const quantity = inventory[menuItem.id] || 0;
          const stockStatus = getStockStatus(quantity);
          
          return (
            <div key={menuItem.id} className="inventory-item">
              <div className="item-name">{menuItem.name}</div>
              <div className="current-stock">재고: {quantity}개</div>
              <div className={`stock-status ${stockStatus.className}`}>
                {stockStatus.text}
              </div>
              
              <div className="quantity-controls">
                <button 
                  className="quantity-btn minus"
                  onClick={() => handleQuantityChange(menuItem.id, quantity - 1)}
                >
                  -
                </button>
                
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  onChange={(e) => handleQuantityInput(menuItem.id, e.target.value)}
                  min="0"
                />
                
                <button 
                  className="quantity-btn plus"
                  onClick={() => handleQuantityChange(menuItem.id, quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventorySection;
