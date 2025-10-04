-- 커피 주문 앱 데이터베이스 스키마

-- 데이터베이스 생성 (필요시)
-- CREATE DATABASE coffee_order_db;

-- Menus 테이블
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url VARCHAR(255),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER DEFAULT 0,
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_items JSONB NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'ORDER_RECEIVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('ORDER_RECEIVED', 'MAKING', 'COMPLETED'))
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_datetime ON orders(order_datetime);
CREATE INDEX IF NOT EXISTS idx_options_menu_id ON options(menu_id);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at
    BEFORE UPDATE ON menus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_options_updated_at ON options;
CREATE TRIGGER update_options_updated_at
    BEFORE UPDATE ON options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 초기 데이터 삽입
INSERT INTO menus (name, description, price, image_url, stock_quantity) VALUES
('아메리카노', '진한 에스프레소와 뜨거운 물의 완벽한 조화', 4500, '/images/americano.svg', 50),
('카페 라떼', '부드러운 우유와 에스프레소의 만남', 5000, '/images/cafe-latte.svg', 35),
('카푸치노', '진한 에스프레소 위에 올라간 벨벳같은 우유 거품', 5000, '/images/cappuccino.svg', 40)
ON CONFLICT DO NOTHING;

-- 옵션 초기 데이터 삽입
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 1),
('샷 추가', 500, 2),
('샷 추가', 500, 3),
('바닐라 시럽', 500, 2),
('시나몬 추가', 0, 3)
ON CONFLICT DO NOTHING;
