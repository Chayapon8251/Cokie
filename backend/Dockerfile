# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy Prisma schema (อยู่ใน src/prisma)
COPY src/prisma ./src/prisma

# Install dependencies และ generate Prisma Client
RUN npm install

# Generate Prisma Client (เผื่อว่า postinstall ไม่ทำงาน)
RUN npx prisma generate

# Copy source code ทั้งหมด
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy Prisma schema
COPY src/prisma ./src/prisma

# Install production dependencies และ generate Prisma Client
RUN npm install --omit=dev && npx prisma generate

# Copy built files
COPY --from=builder /usr/src/app/dist ./dist

# Copy node_modules ที่มี Prisma Client
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "dist/main"]