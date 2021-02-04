FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-inventories

COPY /packages/graphmarket-service-inventories/package.json .

RUN npm install

COPY /packages/graphmarket-service-inventories/tsconfig.json .

COPY /packages/graphmarket-service-inventories/src src

CMD ["npx", "ts-node", "--script-mode", "--transpile-only", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
