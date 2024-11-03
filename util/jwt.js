require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET_KEY;


const JWT_ACCESS_EXPIRATION_TIME = '10s'; 
const JWT_REFRESH_EXPIRATION_TIME = '7d';
const COOKIE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 day (unit : ms)

// 토큰 생성
const create_access = (payload) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: JWT_ACCESS_EXPIRATION_TIME 
  });
};

// 토큰 검증
const verify = (token) => {
  return jwt.verify(token, secret);
};

// 리프레시토큰 생성
const create_refresh = (payload) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: JWT_REFRESH_EXPIRATION_TIME 
  });
};


let cookie_option;
if (process.env.APP_ENVIRONMENT == "development") {
  cookie_option = {
    path: "/",
    httpOnly: true, // 클라이언트 측 js 에서 쿠키 접근 불가
    sameSite: "lax", // 다른 출처의 요청 중 get 요청에서만 쿠키 전송 가능
    secure: false, // https 가 아닌 경우도 쿠키 전송 가능
    maxAge: COOKIE_EXPIRATION_TIME
  };
} else if (process.env.APP_ENVIRONMENT == "production") {
  cookie_option = {
    path: "/",
    httpOnly: true, // 클라이언트 측 js 에서 쿠키 접근 불가
    sameSite: "none", // 다른 출처의 요청에서도 쿠키 전송 가능
    secure: true, // HTTPS를 통해서만 쿠키를 전송 (sameSite: none 일 때만 필요)
    maxAge: COOKIE_EXPIRATION_TIME
  };
}

module.exports = { create_access, verify, create_refresh, cookie_option };
