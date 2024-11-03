// 필요한 모듈 불러오기
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models"); // 모델 경로에 맞게 수정하세요
require("dotenv").config();

const app = express();

// 데이터베이스 연결 확인
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

// 데이터베이스 동기화 (주의: { force: true }는 기존 테이블을 삭제하므로 제품 환경에서는 사용하지 마세요)
sequelize
  .sync()
  .then(() => console.log("DB SYNC SUCCESS"))
  .catch((err) => console.log("DB SYNC FAIL:", err));

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONT_APP_URL, // 프론트엔드 서버 주소
    // origin: true,
    credentials: true, // 쿠키를 포함한 요청 허용
  })
);

// 요청 본문 파싱을 위한 미들웨어 설정
app.use(
  express.urlencoded({ extended: true, limit: "300mb", parameterLimit: 100000 })
);
app.use(express.json({ limit: "300mb" }));

// app.all("/*", function (req, res, next) {
//   res.header("Access-Control-Allow-Ogigin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} request to ${req.originalUrl} from ${req.ip}`
  );
  console.log(`Headers:`, req.headers);
  console.log(`Body:`, req.body);
  next();
});


app.use("/tuning", require("./router/tuning.js"));
app.use("/open", require("./router/open.js"));
app.use(require("./middleware/token.js").token);
app.use("/feed", require("./router/feed.js"));
app.use("/history", require("./router/history.js"));
app.use("/note", require("./router/note.js"));
app.use("/health", require("./router/health.js"));

// 서버 시작
const PORT = process.env.APP_PORT || 3000; // 포트 설정
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
