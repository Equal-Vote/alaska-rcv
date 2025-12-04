###############
# Build Stage # 
###############

FROM node:20.11.1-bullseye-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# Run "npm ci" first so node_modules container layers are cached. This should
# allow us to quickly iterate changes to the code without having to wait for
# "npm ci" every time we commit.
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./

# Run "npm build" steps after "npm ci" to take advantage of caching.
RUN npm ci --omit=dev
RUN npm i typescript

COPY --chown=node:node . /usr/src/app/

RUN npm run build

####################
# Production Stage #
####################

FROM node:20.11.1-bullseye-slim
ENV NODE_ENV=production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
EXPOSE 3000