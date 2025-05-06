# 베이스 이미지로 Node.js 20 LTS 버전을 사용합니다.
FROM node:20-alpine

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json (또는 yarn.lock)을 복사합니다.
# package-lock.json이 있다면 yarn.lock 대신 사용합니다.
COPY package*.json ./

# 의존성을 설치합니다.
# yarn을 사용한다면 RUN yarn install --frozen-lockfile
RUN yarn install --frozen-lockfile

# 소스 코드를 복사합니다.
COPY . .

# 애플리케이션이 실행될 포트를 설정합니다. (server.js에서 사용하는 포트로 변경해주세요)
EXPOSE 4000

# 애플리케이션을 실행합니다.
CMD [ "node", "server.js" ] 