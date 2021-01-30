FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-gateway

COPY /packages/graphmarket-gateway/package.json .

RUN npm install

COPY /packages/graphmarket-gateway .

ENV NODE_ENV=production

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
