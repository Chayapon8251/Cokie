import axios from 'axios';

// 1. สร้าง Instance ของ Axios (ตั้งค่าเริ่มต้น)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. สร้าง "Interceptor" (ตัวดักจับ Request ก่อนส่ง)
// หน้าที่: แอบยัด Token ใส่ Header ให้ทุกครั้ง ถ้ามี Token อยู่
api.interceptors.request.use(
  (config) => {
    // ลองดึง Token จาก LocalStorage (ที่เก็บใน Browser)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // ถ้ามี Token ให้ใส่เข้าไปใน Header: Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (Optional) สร้าง Interceptor ขาตอบกลับ (Response)
// หน้าที่: ถ้าเจอ Error 401 (Token หมดอายุ) อาจจะสั่งให้ Logout อัตโนมัติได้ในอนาคต
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ถ้า Token หมดอายุ หรือปลอม อาจจะสั่งลบ Token ทิ้ง
      // if (typeof window !== 'undefined') localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;