
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

# Este comando se ejecuta cuando el contenedor arranca.
# Copia el dist generado hacia un volumen compartido con Nginx.
CMD ["sh", "-c", "rm -rf /dist/* && cp -r /app/dist/* /dist"]