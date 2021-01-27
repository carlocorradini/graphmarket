FROM node

WORKDIR /graphmarket

COPY tsconfig.common.json .

WORKDIR /graphmarket/packages/graphmarket-service-products

COPY /packages/graphmarket-service-products/package*.json ./

RUN npm install

COPY /packages/graphmarket-service-products .

RUN npm run build

RUN npm prune --production=true

CMD ["npm", "run", "start"]
