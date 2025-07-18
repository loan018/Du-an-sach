import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Search, User, Bell } from "lucide-react";
import { useFavorite } from "../../contexts/FavoriteContext";
import { useCart } from "../../contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/Admin/useAuth";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
} from "../../services/bellService";

interface NotificationItem {
  _id: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt?: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorite();
  const { cartItems } = useCart();
  const { currentUser, setCurrentUser } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo", err);
    }
  };

  useEffect(() => {
    if (currentUser) fetchNotifications();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null); // cập nhật context
    alert("Đăng xuất thành công");
    navigate("/login");
  };

  const handleIconClick = (path: string, message: string) => {
    if (!localStorage.getItem("token")) {
      alert(message);
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      navigate(`/tìmkiem?q=${encodeURIComponent(trimmed)}`);
      setSearchInput("");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Lỗi xoá thông báo", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Lỗi đánh dấu tất cả đã đọc", err);
    }
  };

  return (
    <header className="w-full border-b text-sm shadow-md bg-[#5b3c1d]">
      <div className="px-6 py-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-white uppercase text-center md:text-left cursor-pointer"
          >
            BOOKNEXT
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex items-center bg-white rounded-full px-4 py-1 shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-[#5b3c1d]">
              <input
                type="text"
                placeholder="Tìm kiếm sách..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-2 py-1 text-sm text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="text-[#5b3c1d] hover:text-[#3e2a15] transition flex items-center justify-center"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white">
            <div
              className="relative cursor-pointer hover:text-[#f8c291] transition"
              onClick={() =>
                handleIconClick(
                  "/yeuthich",
                  "Vui lòng đăng nhập để xem danh sách yêu thích."
                )
              }
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {favorites.length}
                </span>
              )}
            </div>

            <div
              className="relative cursor-pointer hover:text-[#f8c291] transition"
              onClick={() =>
                handleIconClick("/cart", "Vui lòng đăng nhập để xem giỏ hàng.")
              }
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* Chuông thông báo */}
            <div className="relative cursor-pointer">
              <div
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  handleMarkAllRead();
                }}
                className="hover:text-[#f8c291] transition"
              >
                <Bell size={20} />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1 rounded-full">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded shadow-md z-50 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-2 text-sm">Không có thông báo</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`px-4 py-2 border-b text-sm ${
                          !n.isRead ? "bg-yellow-100 font-semibold" : ""
                        }`}
                      >
                        <div
                          onClick={() => {
                            handleMarkAsRead(n._id);
                            if (n.link) navigate(n.link);
                          }}
                          className="cursor-pointer"
                        >
                          {n.message}
                        </div>
                        <button
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => handleDelete(n._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative group">
              <div
                className="cursor-pointer hover:text-[#f8c291] transition flex items-center gap-1"
                onClick={() => {
                  if (!currentUser) navigate("/login");
                }}
              >
                <User size={20} />
                {currentUser && <span className="hidden md:inline">{currentUser.name}</span>}
              </div>

              {currentUser && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => navigate("/profile")}
                  >
                    Tài khoản của tôi
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => navigate("profile/orders")}
                  >
                    Đơn hàng
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="flex justify-center gap-6 mt-4 font-medium text-white flex-wrap">
          <Link to="/" className="hover:text-yellow-300 transition">
            Trang chủ
          </Link>
          <Link to="/book" className="hover:text-yellow-300 transition">
            Sách
          </Link>
          <Link to="/contact" className="hover:text-yellow-300 transition">
            Liên hệ
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
