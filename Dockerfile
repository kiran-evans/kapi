FROM node:21-alpine
RUN mkdir -p /main/node_modules && chown -R node:node /main
WORKDIR /main
COPY --chown=node:node dist/ ./
COPY --chown=node:node package*.json ./
RUN npm install
USER node
EXPOSE 8080
CMD [ "node", "index.js" ]