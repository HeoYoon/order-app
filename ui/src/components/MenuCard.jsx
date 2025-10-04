import React from 'react';
import '../styles/MenuCard.css';

const MenuCard = ({ menuItem, selectedOptions, onOptionChange, onAddToCart }) => {
  const calculatePrice = () => {
    let totalPrice = menuItem.price;
    Object.entries(selectedOptions).forEach(([optionKey, isSelected]) => {
      if (isSelected && menuItem.options[optionKey]) {
        totalPrice += menuItem.options[optionKey].price;
      }
    });
    return totalPrice;
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        <img 
          src={menuItem.image} 
          alt={menuItem.name}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="image-placeholder">
          ☕
        </div>
      </div>
      
      <div className="menu-info">
        <h3 className="menu-name">{menuItem.name}</h3>
        <div className="menu-price">{calculatePrice().toLocaleString()}원</div>
        
        {Object.entries(menuItem.options).map(([optionKey, option]) => (
          <label key={optionKey} className="option-label">
            <input
              type="checkbox"
              checked={selectedOptions[optionKey] || false}
              onChange={(e) => onOptionChange(optionKey, e.target.checked)}
              aria-label={`${option.name} ${option.price > 0 ? `추가 옵션 (+${option.price.toLocaleString()}원)` : '무료 옵션'}`}
            />
            <span className="option-text">
              {option.name} {option.price > 0 && `(+${option.price.toLocaleString()}원)`}
            </span>
          </label>
        ))}
        
        <button 
          className="add-to-cart-btn"
          onClick={onAddToCart}
          aria-label={`${menuItem.name}을 장바구니에 추가`}
        >
          + 담기
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
