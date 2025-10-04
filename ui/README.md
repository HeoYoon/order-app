# Coffee ORDER - Frontend

커피 주문 앱의 프론트엔드입니다. React와 Vite를 사용하여 개발되었습니다.

## 🚀 기술 스택

- **React 19** - 사용자 인터페이스 라이브러리
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **React Router DOM** - 클라이언트 사이드 라우팅
- **Vanilla CSS** - 스타일링

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header.jsx      # 네비게이션 헤더
│   ├── MenuCard.jsx    # 메뉴 카드 컴포넌트
│   ├── MenuSection.jsx # 메뉴 섹션
│   ├── CartSection.jsx # 장바구니 섹션
│   ├── CartItem.jsx    # 장바구니 아이템
│   ├── Dashboard.jsx   # 관리자 대시보드
│   ├── InventorySection.jsx # 재고 관리
│   └── OrderStatusSection.jsx # 주문 상태 관리
├── pages/              # 페이지 컴포넌트
│   ├── OrderPage.jsx   # 주문하기 페이지
│   └── AdminPage.jsx   # 관리자 페이지
├── data/               # 정적 데이터
│   └── menuData.js     # 메뉴 데이터
├── styles/             # CSS 스타일 파일
└── utils/              # 유틸리티 함수
```

## 🎯 주요 기능

### 주문하기 화면
- 커피 메뉴 카드 형태로 표시
- 추가 옵션 선택 (샷 추가, 시럽 등)
- 장바구니에 메뉴 추가/삭제
- 실시간 총액 계산
- 주문하기 기능

### 관리자 화면
- 대시보드 (주문 현황 요약)
- 재고 수량 관리
- 주문 상태 관리 (접수 → 제조 중 → 완료)

## 🛠️ 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린팅
npm run lint
```

## 🌐 접속 정보

개발 서버 실행 후 브라우저에서 다음 주소로 접속하세요:
- **주문하기**: http://localhost:5173/
- **관리자**: http://localhost:5173/admin

## 📱 반응형 디자인

- 모바일 우선 설계
- 태블릿 및 데스크톱 대응
- 터치 친화적 UI

## 🎨 디자인 시스템

- **색상**: 깔끔한 흰색 배경, 어두운 버튼
- **타이포그래피**: 명확한 한글 폰트
- **레이아웃**: 카드 기반 디자인
- **상태 표시**: 색상으로 구분 (주황/보라/연두)

## 🔄 다음 단계

- [ ] 백엔드 API 연동
- [ ] 실제 이미지 추가
- [ ] 주문 내역 저장 기능
- [ ] 재고 부족 알림
- [ ] 주문 완료 알림