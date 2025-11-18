import api from '@/lib/axios'; // เรียกใช้ตัวยิงกลางที่เราทำไว้

// กำหนด Type ของข้อมูลที่จะส่งไป (ให้ตรงกับ Backend DTO)
interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  // ฟังก์ชันสมัครสมาชิก
  register: async (data: RegisterInput) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // ฟังก์ชัน Login
  login: async (data: LoginInput) => {
    const response = await api.post('/auth/login', data);
    // Backend ส่งกลับมาเป็น { accessToken: "..." }
    return response.data;
  },

  // ฟังก์ชันดึงข้อมูลโปรไฟล์ตัวเอง
  getProfile: async () => {
    // ไม่ต้องใส่ Token เอง เพราะ Interceptor ใน axios.ts ทำให้แล้ว!
    const response = await api.get('/auth/me');
    return response.data;
  },
};