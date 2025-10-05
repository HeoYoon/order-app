const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 보안 미들웨어
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.'
});
app.use(limiter);

// CORS 설정
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174', // Vite가 다른 포트를 사용할 수 있음
    'http://localhost:3000'  // 추가적인 포트 지원
  ],
  credentials: true
}));

// JSON 파싱 미들웨어
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
app.use('/uploads', express.static('uploads'));

// 라우트 설정
app.use('/api/menus', require('./routes/menus'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '커피 주문 앱 API 서버',
    version: '1.0.0',
    endpoints: {
      menus: '/api/menus',
      orders: '/api/orders',
      dashboard: '/api/dashboard'
    }
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    error: '요청한 엔드포인트를 찾을 수 없습니다.',
    path: req.originalUrl
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? '서버 내부 오류가 발생했습니다.' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 프론트엔드 URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🌐 API 문서: http://localhost:${PORT}`);
});

module.exports = app;
