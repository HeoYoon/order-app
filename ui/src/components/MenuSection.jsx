import React, { useState } from 'react';
import MenuCard from './MenuCard';
import '../styles/MenuSection.css';

const MenuSection = ({ menuItems, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (menuId, optionKey, checked) => {
    setSelectedOptions(prev => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        [optionKey]: checked
      }
    }));
  };

  const handleAddToCart = (menuItem) => {
    const options = selectedOptions[menuItem.id] || {};
    onAddToCart(menuItem, options);
    
    // 담기 후 해당 메뉴의 옵션 선택 초기화
    setSelectedOptions(prev => ({
      ...prev,
      [menuItem.id]: {}
    }));
  };

  return (
    <section className="menu-section">
      <h2 className="section-title">메뉴</h2>
      <div className="menu-grid">
        {menuItems.map(menuItem => (
          <MenuCard
            key={menuItem.id}
            menuItem={menuItem}
            selectedOptions={selectedOptions[menuItem.id] || {}}
            onOptionChange={(optionKey, checked) => 
              handleOptionChange(menuItem.id, optionKey, checked)
            }
            onAddToCart={() => handleAddToCart(menuItem)}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
