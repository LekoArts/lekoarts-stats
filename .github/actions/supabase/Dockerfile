FROM node:18-slim

ADD package.json /package.json
ADD yarn.lock /yarn.lock

ADD ./src/index.ts /src/index.ts

RUN yarn
RUN yarn build

ADD ./dist/index.mjs /dist/index.mjs

ENTRYPOINT [ "node", "/dist/index.mjs" ]
