// 커피 메뉴 데이터
export const menuItems = [
  {
    id: 1,
    name: '아메리카노',
    price: 4500,
    image: '/images/americano.svg',
    options: {
      extraShot: { name: '샷 추가', price: 500 },
      syrup: { name: '시럽 추가', price: 0 }
    }
  },
  {
    id: 2,
    name: '카페 라떼',
    price: 5000,
    image: '/images/cafe-latte.svg',
    options: {
      extraShot: { name: '샷 추가', price: 500 },
      vanillaSyrup: { name: '바닐라 시럽', price: 500 }
    }
  },
  {
    id: 3,
    name: '카푸치노',
    price: 5000,
    image: '/images/cappuccino.svg',
    options: {
      extraShot: { name: '샷 추가', price: 500 },
      cinnamon: { name: '시나몬 추가', price: 0 }
    }
  }
];

// 옵션 가격 매핑 (중앙 집중화)
export const optionPrices = {
  extraShot: 500,
  syrup: 0,
  vanillaSyrup: 500,
  cinnamon: 0
};

// 초기 재고 데이터
export const initialInventory = {
  1: 50, // 아메리카노
  2: 35, // 카페 라떼
  3: 40  // 카푸치노
};
