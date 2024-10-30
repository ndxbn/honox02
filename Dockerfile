FROM  oven/bun:alpine@sha256:3dc101cc42433f8a470da07701441afdb1aab4c6d056a291eb405e348c5a5c37

COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY package.json bun.lockb ./

ENV NODE_ENV=production
RUN bun install

ENTRYPOINT ["bun"]
CMD ["start"]
