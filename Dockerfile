# dev-stage
FROM node:12.18.4 as dev-stage
WORKDIR /web/sistemaweb
COPY package*.json ./
RUN npm install
COPY . .

# build-stage
FROM dev-stage as build-stage
RUN npm run build

# prod-stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /web/sistemaweb/dist /web/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d
COPY certs /etc/nginx/certs

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]