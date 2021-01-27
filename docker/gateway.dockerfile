FROM node:lts

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-gateway

COPY /packages/graphmarket-gateway/package.json .

RUN npm install

COPY /packages/graphmarket-gateway .

RUN npm run build

RUN npm prune --production=true

CMD ["npm", "run", "start"]
