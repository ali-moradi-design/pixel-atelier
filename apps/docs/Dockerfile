# Docs site image. It holds only the build output: build first (on Linux, as CI
# does), then use the standalone folder as the build context:
#   pnpm build
#   docker build -f apps/docs/Dockerfile -t pixelbits-docs apps/docs/.next/standalone
# The folder already has public/ and .next/static (scripts/standalone.ts).
FROM node:24.13.0-bookworm-slim
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --chown=node:node . .
# never run as root
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "apps/docs/server.js"]
