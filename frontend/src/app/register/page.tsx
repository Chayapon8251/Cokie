"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  // State สำหรับเก็บค่าจากฟอร์ม
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State สำหรับสถานะ
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. ตรวจสอบว่ารหัสผ่านตรงกันไหม
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกันครับ");
      return;
    }

    setIsLoading(true);

    try {
      // 2. เรียก API สมัครสมาชิก
      await authService.register({ name, email, password });

      // 3. ถ้าสำเร็จ
      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      router.push("/login"); // ดีดไปหน้า Login
    } catch (err: any) {
      // 4. ถ้าพัง (เช่น อีเมลซ้ำ)
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cookie-cream font-sans text-cookie-dark">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-cookie-latte/30">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cookie-brown mb-2">
            สร้างบัญชีใหม่ 🍪
          </h2>
          <p className="text-gray-500 text-sm">
            เข้าร่วมเป็นส่วนหนึ่งของครอบครัว Cokie Dorm
          </p>
        </div>

        {/* แสดง Error ถ้ามี */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ชื่อผู้ใช้ */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              ชื่อของคุณ
            </label>
            <input
              type="text"
              required
              className="w-full px-4 text-gray-900 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cookie-brown focus:border-transparent outline-none transition"
              placeholder="สมชาย ใจดี"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* อีเมล */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cookie-brown focus:border-transparent outline-none transition"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* รหัสผ่าน */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cookie-brown focus:border-transparent outline-none transition"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cookie-brown focus:border-transparent outline-none transition"
              placeholder="ใส่รหัสผ่านอีกครั้ง"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* ปุ่ม Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-cookie-brown hover:bg-[#6d4a30] text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
          </button>

        </form>

        {/* ลิงก์กลับไปหน้า Login */}
        <div className="mt-6 text-center text-sm text-gray-500">
          มีบัญชีอยู่แล้ว?{" "}
          <a href="/login" className="text-cookie-brown hover:underline font-bold">
            เข้าสู่ระบบเลย
          </a>
        </div>

      </div>
    </div>
  );
}