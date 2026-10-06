FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY conocimiento ./conocimiento
# las preguntas que Zoft no supo responder se guardan acá (montar un volumen para no perderlas)
RUN mkdir -p /app/registro && chown node:node /app/registro
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:8787/salud || exit 1
CMD ["node", "src/servidor.js"]
