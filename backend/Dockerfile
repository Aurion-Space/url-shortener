FROM node:20-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --chown=nodejs:nodejs . ./

USER nodejs

EXPOSE 3001

CMD ["node", "src/app.js"]
