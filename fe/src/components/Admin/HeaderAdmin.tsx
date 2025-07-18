import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../interface/auth";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
} from "../../services/bellService";

const HeaderAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [keyword, setKeyword] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Đăng xuất thành công")
    navigate("/login");
  };

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    navigate(`/admin/search?q=${encodeURIComponent(trimmed)}`);
    setKeyword("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Không đánh dấu đã đọc:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Không xoá được thông báo:", err);
    }
  };

  const handleDropdownToggle = async () => {
    setShowDropdown((prev) => !prev);
    if (!showDropdown) {
      try {
        await markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Không đánh dấu tất cả đã đọc:", err);
      }
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#5D4524] text-white flex items-center justify-between px-6 shadow-md z-40">
      <div className="w-40" />

      {/* Thanh tìm kiếm */}
      <div className="flex w-[500px] h-12 bg-[#fdf6e3] rounded shadow-sm">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng, sách, đánh giá..."
          className="flex-grow px-4 h-full text-[#333] text-base placeholder-gray-600 focus:outline-none rounded-l bg-[#fdf6e3]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="h-full px-4 bg-[#A1887F] hover:bg-[#8D6E63] text-white rounded-r flex items-center justify-center"
        >
          <FaSearch />
        </button>
      </div>

      {/* Thông tin người dùng và thông báo */}
      <div className="flex items-center space-x-4 text-lg font-bold uppercase relative">
        <div className="relative cursor-pointer" onClick={handleDropdownToggle}>
          <FaBell title="Thông báo" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          )}

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded text-black z-50 max-h-[600px] overflow-y-auto">
              <div className="px-4 pt-3 pb-1 font-bold border-b">Thông báo</div>
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((n, idx) => (
                    <li
                      key={idx}
                      className={`px-4 py-3 border-b text-sm flex justify-between items-start gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-150 ${
                        !n.isRead
                          ? "bg-gray-100 font-semibold text-black"
                          : "text-gray-500"
                      }`}
                      onClick={() => {
                        if (!n.isRead) handleMarkAsRead(n._id);
                        n.link && navigate(n.link);
                      }}
                    >
                      <div className="flex-1">
                        📌 {n.message}
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(n.createdAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                      <FaTrash
                        className="text-red-500 cursor-pointer mt-0.5"
                        title="Xoá thông báo"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(n._id);
                        }}
                      />
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-4 text-sm text-gray-500 italic text-center">
                    Không có thông báo
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-2xl" />
          {user && (
            <div className="text-sm leading-tight text-left">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-200 italic">
                {user.role === "admin" ? "Quản trị viên" : "Nhân viên"}
              </p>
            </div>
          )}
        </div>

        <button title="Đăng xuất" onClick={handleLogout}>
          <FaSignOutAlt className="text-xl cursor-pointer" />
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
