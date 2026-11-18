FROM node:22-slim

WORKDIR /app

# install only production dependencies; copying package files first lets Docker cache this layer
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# folders for the named volumes, owned by the non-root user
RUN mkdir -p uploads logs && chown -R node:node uploads logs
USER node

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]