FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-reviews

COPY /packages/graphmarket-service-reviews/package.json .

RUN npm install

COPY /packages/graphmarket-service-reviews .

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
