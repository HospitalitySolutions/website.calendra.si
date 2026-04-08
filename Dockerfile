FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_SITE_URL=https://calendra.si
ARG VITE_APP_BASE_URL=https://staging.calendra.si
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL

RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80 443
