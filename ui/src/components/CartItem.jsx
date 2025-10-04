import React from 'react';
import { optionPrices } from '../data/menuData';
import '../styles/CartItem.css';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const calculateItemPrice = () => {
    let totalPrice = item.basePrice;
    Object.entries(item.options).forEach(([optionKey, isSelected]) => {
      if (isSelected) {
        totalPrice += optionPrices[optionKey] || 0;
      }
    });
    return totalPrice;
  };

  const getSelectedOptionsText = () => {
    const selectedOptions = Object.entries(item.options)
      .filter(([_, isSelected]) => isSelected)
      .map(([optionKey, _]) => {
        const optionNames = {
          extraShot: '샷 추가',
          syrup: '시럽 추가',
          vanillaSyrup: '바닐라 시럽',
          cinnamon: '시나몬 추가'
        };
        return optionNames[optionKey] || optionKey;
      });
    
    return selectedOptions.length > 0 ? selectedOptions.join(', ') : '';
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleQuantityInput = (value) => {
    const quantity = parseInt(value) || 1;
    if (quantity >= 1) {
      onUpdateQuantity(item.id, quantity);
    }
  };

  return (
    <div className="cart-item">
      <div className="item-info">
        <div className="item-name">
          {item.name}
        </div>
        {getSelectedOptionsText() && (
          <div className="item-options">
            {getSelectedOptionsText()}
          </div>
        )}
        <div className="item-price">
          {calculateItemPrice().toLocaleString()}원
        </div>
      </div>
      
      <div className="item-controls">
        <div className="quantity-controls">
          <button 
            className="quantity-btn minus"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            -
          </button>
          
          <input
            type="number"
            className="quantity-input"
            value={item.quantity}
            onChange={(e) => handleQuantityInput(e.target.value)}
            min="1"
          />
          
          <button 
            className="quantity-btn plus"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            +
          </button>
        </div>
        
        <button 
          className="remove-btn"
          onClick={onRemove}
          aria-label="아이템 삭제"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartItem;
