FROM node:21-alpine
RUN mkdir -p /main/node_modules && chown -R node:node /main
WORKDIR /main
COPY --chown=node:node package*.json ./
COPY --chown=node:node dist/ ./
RUN npm install --omit=dev
USER node
EXPOSE 8080
CMD [ "node", "index.js" ]