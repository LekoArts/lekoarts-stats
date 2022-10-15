FROM node:18-slim

ADD package.json /package.json
ADD yarn.lock /yarn.lock

ADD ./src/index.ts /src/index.ts

RUN yarn
RUN yarn build

ENTRYPOINT [ "node", "/dist/index.mjs" ]
