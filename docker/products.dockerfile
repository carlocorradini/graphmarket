FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-products

COPY /packages/graphmarket-service-products/package.json .

RUN npm install

COPY /packages/graphmarket-service-products .

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
