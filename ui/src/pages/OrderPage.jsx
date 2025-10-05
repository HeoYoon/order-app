import React, { useState, useEffect } from 'react';
import { menuAPI, orderAPI } from '../utils/api';
import Header from '../components/Header';
import MenuSection from '../components/MenuSection';
import CartSection from '../components/CartSection';
import '../styles/OrderPage.css';

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const response = await menuAPI.getAllMenus();
        if (response.success) {
          setMenuItems(response.data);
        } else {
          setError('메뉴를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('메뉴 로드 오류:', err);
        setError('메뉴를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

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
          // 옵션 가격을 메뉴 데이터에서 가져오기
          const menu = menuItems.find(m => m.id === item.menuId);
          const option = menu?.options?.find(opt => opt.name === optionKey);
          return sum + (option?.price || 0);
        }
        return sum;
      }, 0);
      
      return total + ((item.basePrice + optionsTotal) * item.quantity);
    }, 0);
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    
    // 주문 확인
    const totalAmount = calculateTotal();
    const confirmMessage = `주문하시겠습니까?\n\n총 ${cartItems.length}개 상품\n총 금액: ${totalAmount.toLocaleString()}원`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // 주문 데이터 구성
        const orderItems = cartItems.map(item => {
          const optionsTotal = Object.entries(item.options).reduce((sum, [optionKey, isSelected]) => {
            if (isSelected) {
              const menu = menuItems.find(m => m.id === item.menuId);
              const option = menu?.options?.find(opt => opt.name === optionKey);
              return sum + (option?.price || 0);
            }
            return sum;
          }, 0);

          return {
            menu_id: item.menuId,
            quantity: item.quantity,
            options: Object.keys(item.options).filter(key => item.options[key]),
            item_price: item.basePrice + optionsTotal
          };
        });

        const orderData = {
          items: orderItems,
          total_amount: totalAmount
        };

        // 주문 API 호출
        const response = await orderAPI.createOrder(orderData);
        
        if (response.success) {
          alert(`주문이 완료되었습니다! 🎉\n\n주문 번호: #${response.data.order_id}\n총 금액: ${totalAmount.toLocaleString()}원\n\n감사합니다!`);
          setCartItems([]);
        } else {
          alert('주문 처리 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('주문 생성 오류:', error);
        alert(`주문 처리 중 오류가 발생했습니다: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="order-page">
        <Header currentPage="order" />
        <div className="loading-container">
          <p>메뉴를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <Header currentPage="order" />
        <div className="error-container">
          <p>오류: {error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

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
