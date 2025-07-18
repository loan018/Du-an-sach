import React, { useEffect, useState } from "react";
import { getMe } from "../../services/authService";
import { IUser } from "../../interface/auth";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMe();
        setUser(data);
        const avatarUrl = data.avatar?.startsWith("http")
          ? data.avatar
          : data.avatar
          ? `http://localhost:3000/${data.avatar}`
          : "/default-avatar.png";
        setAvatarPreview(avatarUrl);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin:", err);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { label: "Hồ Sơ", path: "/profile" },
    { label: "Đơn Mua", path: "/profile/orders" },
    { label: "MOMO", path: "/profile/momo" },
    { label: "Địa Chỉ", path: "/profile/address" },
    { label: "Đổi Mật Khẩu", path: "/profile/change-password" },
  ];

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <div className="w-64 p-6 border-r border-gray-800">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img
            src={avatarPreview}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{user?.name}</span>
        </div>
        <ul className="space-y-2 text-sm">
          {tabs.map(({ label, path }) => (
            <li
              key={path}
              onClick={() => navigate(path)}
              className={`cursor-pointer px-2 py-1 rounded ${
                location.pathname === path
                  ? "text-red-500"
                  : "text-white hover:text-red-400"
              }`}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Nội dung hiển thị theo route con */}
      <div className="flex-1 px-10 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfile;
