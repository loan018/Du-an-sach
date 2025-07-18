import React from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaShoppingCart,
  FaImage,
  FaComment,
  FaHome,
} from "react-icons/fa";

const SidebarAdmin: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-[#8D6E63] text-white fixed top-0 left-0 z-50 pt-16">
      {/* Header Sidebar */}
      <div className="px-6 py-4 bg-[#5D4524] fixed top-0 left-0 w-64 h-16 flex flex-col items-start justify-center">
        <h2 className="text-xl font-bold uppercase">BOOKNEXT</h2>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 p-4 space-y-2 text-lg font-bold uppercase">
        <Link to="/admin" className="flex items-center p-2 hover:bg-[#A1887F] rounded">
          <FaHome className="mr-3" />
          Trang chủ
        </Link>
        <Link to="/admin/banner" className="flex items-center p-2 hover:bg-[#A1887F] rounded">
          <FaImage className="mr-3" />
          Slider
        </Link>
        <Link to="/admin/category" className="flex items-center p-2 hover:bg-[#A1887F] rounded">
          <FaClipboardList className="mr-3" />
          Danh mục
        </Link>
        <Link to="/admin/book" className="flex items-center p-2 hover:bg-[#A1887F] rounded">
          <FaBoxOpen className="mr-3" />
          Sách
        </Link>
          <Link to="/admin/user" className="flex items-center p-2 hover:bg-[#A1887F] rounded">
          <FaUsers className="mr-3" />
          Thành viên
        </Link>
        <Link to="/admin/order" className="flex items-center p-2 hover:bg-[#A1887F] rounded">
          <FaShoppingCart className="mr-3" />
          Đơn hàng
        </Link>
        <Link to="/admin/review" className="flex items-center p-2 hover:bg-[#A1887F] rounded">
          <FaComment className="mr-3" />
          Nhận xét
        </Link>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
