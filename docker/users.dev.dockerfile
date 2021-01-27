FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-users

COPY /packages/graphmarket-service-users/package.json .

RUN npm install

COPY /packages/graphmarket-service-users .

ENV NODE_ENV=development

CMD ["npx", "cross-env", "ts-node-dev", "--prefer-ts", "true", "--no-notify", "--quiet", "--exit-child", "-r", "tsconfig-paths/register", "--transpile-only", "src/bootstrap.ts"]
