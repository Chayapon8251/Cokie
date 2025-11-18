"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "TENANT";
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const userData = await authService.getProfile();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-cookie-cream text-cookie-brown">Loading...</div>;
  if (!user) return null;

  return (
    // 1. พื้นหลังสีครีม
    <div className="min-h-screen bg-cookie-cream font-sans text-cookie-dark">
      
      {/* Header: สีขาว ตัดขอบน้ำตาลอ่อน */}
      <header className="bg-white border-b border-cookie-latte px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-cookie-brown tracking-tight">
          🍪 Cokie Dorm
        </h1>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{user.name || user.email}</p>
            <p className="text-xs text-gray-500 tracking-wider">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-cookie-brown hover:text-cookie-dark underline decoration-cookie-latte underline-offset-4 transition"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* การ์ดต้อนรับ */}
        <div className="bg-cookie-brown text-white p-8 rounded-2xl shadow-lg mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {user.role === "OWNER" ? "Welcome Back, Boss! 💼" : "Welcome Home! 🏡"}
            </h2>
            <p className="text-cookie-latte opacity-90">
              {user.role === "OWNER" ? "จัดการหอพักของคุณได้ที่นี่" : "พักผ่อนให้สบายนะครับ"}
            </p>
          </div>
          {/* (Optional) ใส่รูปตกแต่งตรงนี้ได้ */}
          <div className="text-5xl opacity-20">🍪</div>
        </div>

        {/* เมนู Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.role === "OWNER" ? (
            <>
              <MenuCard title="จัดการห้องพัก" icon="🏠" desc="สร้าง/แก้ไข ข้อมูลห้อง" />
              <MenuCard title="ออกบิล" icon="🧾" desc="เรียกเก็บเงินรายเดือน" />
              <MenuCard title="ประกาศ" icon="📢" desc="แจ้งข่าวสารลูกบ้าน" />
            </>
          ) : (
            <>
              {/* ปุ่มนี้เดี๋ยวเราจะทำให้กดได้จริง! */}
              <MenuCard title="ห้องของฉัน" icon="🔑" desc="ดูรหัส WiFi และข้อมูลห้อง" highlight />
              <MenuCard title="บิลค่าเช่า" icon="💸" desc="ประวัติการชำระเงิน" />
              <MenuCard title="แจ้งซ่อม" icon="🔧" desc="แจ้งปัญหาต่างๆ" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function MenuCard({ title, icon, desc, highlight = false }: { title: string; icon: string; desc: string, highlight?: boolean }) {
  return (
    <div className={`
      group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md
      ${highlight 
        ? "bg-white border-cookie-brown/30 hover:border-cookie-brown" 
        : "bg-white border-transparent hover:border-cookie-latte"}
    `}>
      <div className="w-12 h-12 bg-cookie-cream rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-cookie-dark mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}