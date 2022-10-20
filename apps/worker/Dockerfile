# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn nx build worker --skip-nx-cache

# production stage
FROM node:16 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist/apps/worker ./dist/apps/worker
# Install runtime dependencies - npm used here due to package nesting issues
# when using yarn
RUN cd dist/apps/worker && npm i --legacy-peer-deps
COPY static ./static
EXPOSE 3123
CMD ["node", "dist/apps/worker/main.js"]
