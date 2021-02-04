FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-purchases

COPY /packages/graphmarket-service-purchases/package.json .

RUN npm install

COPY /packages/graphmarket-service-purchases/tsconfig.json .

COPY /packages/graphmarket-service-purchases/src src

CMD ["npx", "ts-node", "--script-mode", "--transpile-only", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
