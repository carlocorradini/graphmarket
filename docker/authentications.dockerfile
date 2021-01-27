FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-authentications

COPY /packages/graphmarket-service-authentications/package.json .

RUN npm install

COPY /packages/graphmarket-service-authentications .

ENV NODE_ENV=production

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
