import React from 'react';
import CartItem from './CartItem';
import '../styles/CartSection.css';

const CartSection = ({ cartItems, onRemoveItem, onUpdateQuantity, total, onOrder }) => {
  return (
    <section className="cart-section">
      <div className="cart-header">
        <span className="cart-icon">🛒</span>
        <h2 className="cart-title">장바구니</h2>
      </div>
      
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            장바구니가 비어있습니다
          </div>
        ) : (
          cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => onRemoveItem(item.id)}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))
        )}
      </div>
      
      <div className="cart-footer">
        <div className="total-section">
          <span className="total-label">총액</span>
          <span className="total-amount">{total.toLocaleString()}원</span>
        </div>
        
        <button 
          className="order-btn"
          onClick={onOrder}
          disabled={cartItems.length === 0}
        >
          주문하기
        </button>
      </div>
    </section>
  );
};

export default CartSection;
