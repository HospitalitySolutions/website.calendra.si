FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/ \
 && npm ci --no-audit --no-fund

COPY . .

ARG VITE_SITE_URL=https://calendra.si
ARG VITE_APP_BASE_URL=https://app.calendra.si
ARG VITE_LINKEDIN_URL=
ARG VITE_YOUTUBE_URL=
ARG VITE_GOOGLE_PLAY_URL=
ARG VITE_APP_STORE_URL=
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL
ENV VITE_LINKEDIN_URL=$VITE_LINKEDIN_URL
ENV VITE_YOUTUBE_URL=$VITE_YOUTUBE_URL
ENV VITE_GOOGLE_PLAY_URL=$VITE_GOOGLE_PLAY_URL
ENV VITE_APP_STORE_URL=$VITE_APP_STORE_URL

RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80
