################################
# Base
################################
FROM node:12.18-stretch AS base
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app

# Run updates and cleanup
RUN apt-get update && apt-get install -y \
      netcat \
      git && \
      rm -rf /var/lib/apt/lists/*

#  Changing git URL because network is blocking git protocol...
RUN git config --global url."https://".insteadOf git://
RUN git config --global url."https://github.com/".insteadOf git@github.com:

COPY internals /app/internals

COPY .gitignore \
      .gitattributes \
      .eslintrc.js \
      .prettierrc \
      jest.config.js \
      babel.config.js \
      package.json \
      package-lock.json \
      /app/

# Install NPM dependencies, cleaning cache afterwards:
RUN npm --production=false --unsafe-perm --no-progress ci && npm cache clean --force

COPY src /app/src

################################
# Build
################################
FROM node:12.18-stretch AS builder
COPY --from=base /app /app
WORKDIR /app

COPY assets /app/assets

ARG GIT_BRANCH
ENV GIT_BRANCH ${GIT_BRANCH}

ARG BUILD_ENV
ENV BUILD_ENV ${BUILD_ENV}

ENV NODE_ENV=production
RUN echo "run build"
RUN npm run build

# Write the build number
ARG BUILD_NUMBER=0
RUN echo "build ${BUILD_NUMBER} - `date`" > /app/build/version.txt


################################
# Deploy
################################
FROM nginx:stable-alpine

RUN echo -e "https://dl-4.alpinelinux.org/alpine/latest-stable/main\nhttps://dl-4.alpinelinux.org/alpine/latest-stable/community" > /etc/apk/repositories && apk upgrade
RUN apk add --no-cache jq nodejs npm
RUN npm install @exodus/schemasafe lodash.merge

COPY --from=builder /app/build/. /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

COPY environment.base.conf.json /environment.base.conf.json
COPY environment.conf.json /environment.conf.json
COPY internals/schemas/environment.conf.schema.json /internals/schemas/environment.conf.schema.json
COPY internals/scripts/validate-config.js /internals/scripts/validate-config.js
COPY internals/scripts/inject-config.js /internals/scripts/inject-config.js

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
      && ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["/usr/local/bin/start.sh"]
