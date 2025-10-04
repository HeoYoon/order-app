import React, { useState } from 'react';
import { menuItems, optionPrices } from '../data/menuData';
import Header from '../components/Header';
import MenuSection from '../components/MenuSection';
import CartSection from '../components/CartSection';
import '../styles/OrderPage.css';

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (menuItem, selectedOptions = {}) => {
    const cartItem = {
      id: Date.now(),
      menuId: menuItem.id,
      name: menuItem.name,
      basePrice: menuItem.price,
      options: selectedOptions,
      quantity: 1
    };

    setCartItems(prev => [...prev, cartItem]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const optionsTotal = Object.entries(item.options).reduce((sum, [optionKey, isSelected]) => {
        if (isSelected) {
          return sum + (optionPrices[optionKey] || 0);
        }
        return sum;
      }, 0);
      
      return total + ((item.basePrice + optionsTotal) * item.quantity);
    }, 0);
  };

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    
    // 주문 확인
    const totalAmount = calculateTotal();
    const confirmMessage = `주문하시겠습니까?\n\n총 ${cartItems.length}개 상품\n총 금액: ${totalAmount.toLocaleString()}원`;
    
    if (window.confirm(confirmMessage)) {
      // TODO: 주문 API 호출
      alert(`주문이 완료되었습니다! 🎉\n\n주문 번호: #${Date.now().toString().slice(-6)}\n총 금액: ${totalAmount.toLocaleString()}원\n\n감사합니다!`);
      setCartItems([]);
    }
  };

  return (
    <div className="order-page">
      <Header currentPage="order" />
      <div className="order-content">
        <MenuSection 
          menuItems={menuItems} 
          onAddToCart={addToCart}
        />
        <CartSection 
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          total={calculateTotal()}
          onOrder={handleOrder}
        />
      </div>
    </div>
  );
};

export default OrderPage;
