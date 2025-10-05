# 커피 주문 앱 설정 가이드

## 1. 프로젝트 개요

이 프로젝트는 커피 주문 및 관리 시스템으로, React 프론트엔드와 Node.js/Express 백엔드, PostgreSQL 데이터베이스로 구성되어 있습니다.

### 주요 기능
- **주문하기 화면**: 메뉴 선택, 옵션 추가, 장바구니 관리, 주문 생성
- **관리자 화면**: 실시간 대시보드, 재고 관리, 주문 상태 관리

## 2. 환경 설정

### 서버 환경 변수 설정
`server/.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 서버 설정
PORT=3001
NODE_ENV=development

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# 프론트엔드 URL (여러 포트 지원)
FRONTEND_URL=http://localhost:5173
```

### 프론트엔드 환경 변수 설정
`ui/.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 서버 URL
VITE_API_URL=http://localhost:3001
```

## 3. 데이터베이스 설정

### PostgreSQL 설치 및 설정
1. PostgreSQL을 설치합니다.
2. 데이터베이스를 생성합니다:
   ```sql
   CREATE DATABASE coffee_order_db;
   ```
3. `server/config/database.sql` 파일을 실행하여 테이블을 생성합니다.

### 데이터베이스 스키마
- **menus**: 메뉴 정보 (이름, 가격, 이미지, 재고)
- **options**: 메뉴 옵션 (샷 추가, 시럽 등)
- **orders**: 주문 정보 (주문 내용, 상태, 총액)

## 4. 설치 및 실행

### 서버 실행
```bash
cd server
npm install
npm start
```

서버는 `http://localhost:3001`에서 실행됩니다.

### 프론트엔드 실행
```bash
cd ui
npm install
npm run dev
```

프론트엔드는 `http://localhost:5173` 또는 `http://localhost:5174`에서 실행됩니다.

## 5. API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 모든 메뉴 목록 조회 (옵션 포함)
- `GET /api/menus/:id` - 특정 메뉴 상세 정보 조회
- `GET /api/menus/:id/options` - 특정 메뉴의 옵션 목록 조회
- `GET /api/menus/stock/all` - 모든 메뉴의 재고 현황 조회 (관리자용)
- `PUT /api/menus/:id/stock` - 특정 메뉴의 재고 수량 수정 (관리자용)

### 주문 관련
- `POST /api/orders` - 새 주문 생성
- `GET /api/orders` - 모든 주문 목록 조회 (관리자용)
- `GET /api/orders/:id` - 특정 주문 상세 정보 조회
- `PUT /api/orders/:id/status` - 주문 상태 변경 (관리자용)

### 대시보드 관련
- `GET /api/dashboard/stats` - 대시보드 통계 정보 조회

## 6. 주요 기능

### 주문하기 화면
- **메뉴 표시**: API에서 실시간으로 메뉴 데이터 로드
- **옵션 선택**: 각 메뉴별 추가 옵션 (샷 추가, 시럽 등)
- **장바구니**: 선택한 메뉴 관리, 수량 조정, 총액 계산
- **주문 생성**: API를 통한 주문 생성 및 재고 자동 차감

### 관리자 화면
- **실시간 대시보드**: 주문 통계 (전체, 접수, 제조중, 완료)
- **재고 관리**: 메뉴별 재고 수량 실시간 조정
- **주문 현황**: 주문 목록 조회 및 상태 변경 (접수 → 제조중 → 완료)

## 7. 기술 스택

### 프론트엔드
- **React 19**: UI 라이브러리
- **React Router**: 페이지 라우팅
- **Vite**: 빌드 도구
- **CSS3**: 스타일링

### 백엔드
- **Node.js**: 런타임 환경
- **Express**: 웹 프레임워크
- **PostgreSQL**: 데이터베이스
- **pg**: PostgreSQL 클라이언트

### 보안 및 미들웨어
- **CORS**: 크로스 오리진 요청 처리
- **Helmet**: 보안 헤더 설정
- **Rate Limiting**: API 요청 제한

## 8. 문제 해결

### CORS 오류
- 서버가 포트 5173, 5174, 3000을 모두 지원하도록 설정됨
- 브라우저 개발자 도구에서 네트워크 탭 확인

### 데이터베이스 연결 오류
- `.env` 파일의 데이터베이스 설정 확인
- PostgreSQL 서비스 실행 상태 확인
- 데이터베이스 존재 여부 확인

### API 연결 오류
- 프론트엔드의 `VITE_API_URL` 설정 확인
- 서버 실행 상태 확인 (`http://localhost:3001`)
- 브라우저 개발자 도구 콘솔에서 오류 메시지 확인

### 이미지가 표시되지 않는 경우
- 이미지 경로가 올바른지 확인 (`/images/` 폴더)
- 브라우저 개발자 도구에서 404 오류 확인
- 이미지 파일이 `ui/public/images/` 폴더에 있는지 확인

### 버튼 위치 문제
- CSS flexbox 레이아웃으로 카드 높이 고정
- 버튼이 카드 하단에 고정되도록 설정

## 9. 개발 가이드

### 코드 구조
```
order-app/
├── server/                 # 백엔드 서버
│   ├── controllers/        # API 컨트롤러
│   ├── routes/            # API 라우트
│   ├── config/            # 데이터베이스 설정
│   └── app.js             # 서버 진입점
├── ui/                    # 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── utils/         # 유틸리티 함수
│   │   └── styles/        # CSS 스타일
│   └── public/images/     # 정적 이미지
└── docs/                  # 문서
```

### API 응답 형식
```json
{
  "success": true,
  "data": { ... },
  "message": "성공 메시지"
}
```

### 에러 응답 형식
```json
{
  "success": false,
  "message": "오류 메시지"
}
```

## 10. 배포 가이드

### 프로덕션 환경 설정
1. 환경 변수에서 `NODE_ENV=production` 설정
2. 데이터베이스 연결 정보 업데이트
3. CORS 설정에서 프로덕션 도메인 추가
4. 정적 파일 서빙 설정

### 빌드 명령어
```bash
# 프론트엔드 빌드
cd ui && npm run build

# 서버 실행 (프로덕션)
cd server && npm start
```

---

**참고**: 이 가이드는 프로젝트의 현재 상태를 반영하며, 추가 기능이나 변경사항이 있을 때마다 업데이트됩니다.
