# ---------------------------------
# Stage 1: Build Stage
# ---------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง Dependencies
RUN npm install

# Copy โค้ดที่เหลือ
COPY . .

# สั่ง build (Next.js จะสร้างโฟลเดอร์ .next และ .next/standalone)
RUN npm run build

# ---------------------------------
# Stage 2: Production Stage
# ---------------------------------
FROM node:20-alpine

WORKDIR /app

# ตั้งค่า Environment เป็น Production
ENV NODE_ENV=production

# Copy โฟลเดอร์ public (รูปภาพ, font) จาก Stage "builder"
COPY --from=builder /app/public ./public

# Copy โฟลเดอร์ standalone ที่ Next.js สร้างให้
# นี่คือหัวใจสำคัญที่ทำให้ Image เล็กมาก
COPY --from=builder /app/.next/standalone ./

# Copy โฟลเดอร์ static (CSS, JS ของหน้าเว็บ)
COPY --from=builder /app/.next/static ./.next/static

# สั่งให้รัน Next.js server ที่ build มาแล้ว
# (พอร์ต 3000 คือพอร์ต default ที่ Next.js standalone รัน)
EXPOSE 3000
CMD ["node", "server.js"]