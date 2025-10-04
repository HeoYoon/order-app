# 커피 주문 앱 백엔드 서버

Express.js를 사용한 커피 주문 앱의 백엔드 API 서버입니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
cd server
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하고 데이터베이스 설정을 입력하세요.

```bash
cp .env.example .env
```

`.env` 파일 예시:
```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password

# 서버 설정
PORT=3001
NODE_ENV=development

# CORS 설정
FRONTEND_URL=http://localhost:5173
```

### 3. 데이터베이스 설정

PostgreSQL 데이터베이스를 설치하고 다음 SQL 파일을 실행하세요:

```bash
psql -U postgres -d coffee_order_db -f config/database.sql
```

### 4. 서버 실행

#### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

#### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:3001`에서 실행됩니다.

## 📁 프로젝트 구조

```
server/
├── app.js                 # 메인 서버 파일
├── package.json           # 프로젝트 설정 및 의존성
├── .env.example          # 환경 변수 예시
├── .gitignore           # Git 무시 파일
├── README.md            # 프로젝트 문서
├── config/              # 설정 파일
│   ├── database.js      # 데이터베이스 연결 설정
│   └── database.sql     # 데이터베이스 스키마
├── controllers/         # 컨트롤러 (비즈니스 로직)
│   ├── menuController.js
│   ├── orderController.js
│   └── dashboardController.js
└── routes/             # API 라우트
    ├── menus.js
    ├── orders.js
    └── dashboard.js
```

## 🔌 API 엔드포인트

### 메뉴 관련 API

- `GET /api/menus` - 모든 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 상세 정보 조회
- `GET /api/menus/:id/options` - 특정 메뉴의 옵션 목록 조회
- `GET /api/menus/stock/all` - 모든 메뉴의 재고 현황 조회 (관리자용)
- `PUT /api/menus/:id/stock` - 특정 메뉴의 재고 수량 수정 (관리자용)

### 주문 관련 API

- `POST /api/orders` - 새 주문 생성
- `GET /api/orders` - 모든 주문 목록 조회 (관리자용)
- `GET /api/orders/:id` - 특정 주문 상세 정보 조회
- `PUT /api/orders/:id/status` - 주문 상태 변경 (관리자용)

### 대시보드 API

- `GET /api/dashboard/stats` - 대시보드 통계 정보 조회

## 🗄️ 데이터베이스 스키마

### Menus 테이블
- `id` - 메뉴 고유 식별자 (Primary Key)
- `name` - 커피 이름
- `description` - 메뉴 설명
- `price` - 기본 가격
- `image_url` - 메뉴 이미지 URL
- `stock_quantity` - 재고 수량
- `created_at` - 생성 일시
- `updated_at` - 수정 일시

### Options 테이블
- `id` - 옵션 고유 식별자 (Primary Key)
- `name` - 옵션 이름
- `price` - 옵션 가격
- `menu_id` - 연결할 메뉴 ID (Foreign Key)
- `created_at` - 생성 일시
- `updated_at` - 수정 일시

### Orders 테이블
- `id` - 주문 고유 식별자 (Primary Key)
- `order_datetime` - 주문 일시
- `order_items` - 주문 내용 (JSON)
- `total_amount` - 주문 총 금액
- `status` - 주문 상태 (ORDER_RECEIVED, MAKING, COMPLETED)
- `created_at` - 생성 일시
- `updated_at` - 수정 일시

## 🛡️ 보안 기능

- **Helmet**: HTTP 헤더 보안 설정
- **CORS**: Cross-Origin Resource Sharing 설정
- **Rate Limiting**: API 요청 제한 (15분당 100회)
- **입력값 검증**: 모든 API 엔드포인트에서 입력값 검증
- **SQL Injection 방지**: Parameterized queries 사용

## 🔧 개발 도구

- **nodemon**: 개발 시 자동 재시작
- **Jest**: 테스트 프레임워크 (추후 구현 예정)
- **Supertest**: API 테스트 (추후 구현 예정)

## 📝 로깅

서버는 다음과 같은 로그를 출력합니다:
- 데이터베이스 연결 상태
- 쿼리 실행 시간 및 결과
- 에러 메시지 및 스택 트레이스 (개발 모드)

## 🚨 에러 처리

모든 API 엔드포인트는 일관된 에러 응답 형식을 사용합니다:

```json
{
  "success": false,
  "message": "에러 메시지"
}
```

## 🔄 상태 코드

- `200` - 성공
- `201` - 생성 성공
- `400` - 잘못된 요청
- `404` - 리소스를 찾을 수 없음
- `500` - 서버 내부 오류
