# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn nx build admin-ui --skip-nx-cache && yarn nx build server --skip-nx-cache

# production stage
FROM node:16 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist/apps/server ./dist/apps/server
COPY --from=build-stage /app/dist/apps/admin-ui-app ./dist/apps/admin-ui-app
COPY --from=build-stage /app/dist/migrations ./dist/migrations
# Install runtime dependencies - npm used here due to package nesting issues
# when using yarn
RUN cd dist/apps/server && npm i --legacy-peer-deps
COPY static ./static
EXPOSE 3000
CMD ["node", "dist/apps/server/main.js"]
