FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-gateway

COPY /packages/graphmarket-gateway/package.json .

RUN npm install

COPY /packages/graphmarket-gateway/tsconfig.json .

COPY /packages/graphmarket-gateway/src src

CMD ["npx", "ts-node", "--script-mode", "--transpile-only", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
