FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-users

COPY /packages/graphmarket-service-users/package.json .

RUN npm install

COPY /packages/graphmarket-service-users/tsconfig.json .

COPY /packages/graphmarket-service-users/src src

CMD ["npx", "ts-node", "--script-mode", "--transpile-only", "-r", "tsconfig-paths/register", "src/bootstrap.ts"]
