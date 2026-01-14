"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  
  // State สำหรับเก็บค่าจากฟอร์ม
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State สำหรับจัดการสถานะ (Error / Loading)
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันเมื่อกดปุ่ม Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันไม่ให้เว็บ Refresh
    setError(null);
    setIsLoading(true);

    try {
      // 1. เรียก API Login
      const res = await authService.login({ email, password });
      
      // 2. ถ้าสำเร็จ: บันทึก Token ลง LocalStorage
      // (res.accessToken มาจาก Backend ที่เราทำไว้)
      localStorage.setItem("token", res.accessToken);

      alert("Login สำเร็จ! (Token ถูกบันทึกแล้ว)");

      // 3. เปลี่ยนหน้าไปที่ Dashboard (เดี๋ยวเราค่อยไปสร้างหน้านี้กัน)
      router.push("/dashboard"); 
      
      // *หมายเหตุ: ตอนนี้ผม comment router.push ไว้ก่อน 
      // เพื่อให้คุณเห็น alert ยืนยันว่าได้ token จริงๆ
      
    } catch (err: any) {
      // 4. ถ้าพัง: แสดง Error
      // (err.response.data.message คือข้อความจาก Backend NestJS ของเรา)
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          เข้าสู่ระบบหอพัก
        </h2>

        {/* แสดง Error ถ้ามี */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ช่องกรอก Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ช่องกรอก Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ปุ่ม Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brown-600 hover:bg-brown-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:bg-brown-300"
          >
            {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>

        </form>

        {/* ลิงก์ไปหน้าสมัครสมาชิก (เผื่อไว้) */}
        <div className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <a href="/register" className="text-brown-600 hover:underline font-medium">
            สมัครสมาชิก
          </a>
        </div>

      </div>
    </div>
  );
}