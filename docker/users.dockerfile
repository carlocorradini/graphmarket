FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-users

COPY /packages/graphmarket-service-users/package.json .

RUN npm install

COPY /packages/graphmarket-service-users .

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
