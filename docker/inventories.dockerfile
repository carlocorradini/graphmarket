FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-inventories

COPY /packages/graphmarket-service-inventories/package.json .

RUN npm install

COPY /packages/graphmarket-service-inventories .

ENV NODE_ENV=production

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
