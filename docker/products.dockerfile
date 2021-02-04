FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-products

COPY /packages/graphmarket-service-products/package.json .

RUN npm install

COPY /packages/graphmarket-service-products/tsconfig.json .

COPY /packages/graphmarket-service-products/src src

CMD ["npx", "ts-node", "--script-mode", "--transpile-only", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
