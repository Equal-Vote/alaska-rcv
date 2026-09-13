###############
# Build Stage #
###############

FROM node:20.20.2-bullseye-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# Run "npm ci" first so node_modules container layers are cached. This should
# allow us to quickly iterate changes to the code without having to wait for
# "npm ci" every time we commit.
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./

# The build stage needs devDependencies, because that is where the entire build
# toolchain lives: @rsbuild/core, @rsbuild/plugin-react, @rsbuild/plugin-eslint,
# eslint and eslint-config-react-app are all devDependencies.
#
# This used to be `npm ci --omit=dev` followed by `npm i typescript`, which
# omitted that whole toolchain and then got most of it back by accident --
# `npm i <pkg>` re-resolves the tree and drags devDependencies along with it.
# That accident restored enough for rsbuild to load but not the full
# eslint-config-react-app -> eslint-plugin-jest chain, so `npm run build` died
# with `Environment key "jest/globals" is unknown`. Installing the toolchain on
# purpose is both the fix and what the stage always meant to do.
#
# Defensive: Playwright 1.63 has no postinstall, so `npm ci` does not fetch
# browsers, but a future version reintroducing one would try to pull ~170MB
# into this layer. The image never runs Playwright -- that is CI's job.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm ci

COPY --chown=node:node . /usr/src/app/

RUN npm run build

# The production stage copies node_modules from this stage wholesale, so strip
# devDependencies now that the bundle is built. Without this the runtime image
# would ship the whole build toolchain plus Playwright. `serve` is a real
# dependency and survives, which is all `npm run serve` needs.
RUN npm prune --omit=dev

####################
# Production Stage #
####################

FROM node:20.20.2-bullseye-slim
ENV NODE_ENV=production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "serve"]
EXPOSE 3000
