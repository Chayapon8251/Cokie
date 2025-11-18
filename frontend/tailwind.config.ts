import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cookie: {
          cream: "#FDFBF7",      // พื้นหลังครีม
          latte: "#E6D2B5",      // สีน้ำตาลอ่อน (ตัดขอบ)
          brown: "#8B5E3C",      // สีน้ำตาลหลัก (ปุ่ม, หัวข้อ)
          dark: "#4A3426",       // สีช็อกโกแลต (ตัวหนังสือเข้ม)
        },
      },
    },
  },
  plugins: [],
};
export default config;