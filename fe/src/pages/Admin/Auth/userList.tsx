import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllUsers, updateUserRole, hideUser } from "../../../services/authService";
import { IUser } from "../../../interface/auth";
import { EyeOff } from "lucide-react";

const USERS_PER_PAGE = 15;

const UserList: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlKeyword = searchParams.get("search") || "";

  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState(urlKeyword);
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => {
    setKeyword(urlKeyword);
    setCurrentPage(1);
  }, [urlKeyword]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers({
        page: currentPage,
        limit: USERS_PER_PAGE,
        keyword,
        role: roleFilter,
        isActive: activeFilter,
      });
      setUsers(Array.isArray(res?.users) ? res.users : []);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, keyword, roleFilter, activeFilter]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const handleRoleChange = async (id: string, role: IUser["role"]) => {
    if (!currentUser || currentUser.role !== "admin") return;
    await updateUserRole(id, role);
    alert("Cập nhật vai trò thành công");
    fetchUsers();
  };

  const handleHide = async (id: string) => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập để thực hiện thao tác này.");
      return;
    }

    const confirm = window.confirm("Bạn có chắc muốn ẩn người dùng này không?");
    if (!confirm) return;

    try {
      await hideUser(id);
      alert("Người dùng đã được ẩn thành công.");
      fetchUsers();
    } catch (error) {
      alert("Có lỗi xảy ra khi ẩn người dùng.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-rose-700">
        Quản lý tài khoản
      </h1>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm tên hoặc email..."
          value={keyword}
          onChange={(e) => {
            setCurrentPage(1);
            setKeyword(e.target.value);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-72 shadow-sm"
        />

        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setRoleFilter(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>

          <select
            value={activeFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setActiveFilter(e.target.value);
            }}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-black shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-rose-200 text-rose-900 font-semibold">
              <th className="p-3 text-center border">STT</th>
              <th className="p-3 text-center border">Ảnh</th>
              <th className="p-3 text-center border">Họ tên</th>
              <th className="p-3 text-center border">Email</th>
              <th className="p-3 text-center border">SĐT</th>
              <th className="p-3 text-center border">Vai trò</th>
              <th className="p-3 text-center border">Trạng thái</th>
              {currentUser?.role === "admin" && (
                <th className="p-3 text-center border">Hành động</th>
              )}
            </tr>
          </thead>
          <tbody className="border-t border-b border-gray-400">
            {users?.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    !user.isActive ? "bg-gray-100 text-gray-500" : "hover:bg-rose-50"
                  }`}
                >
                  <td className="p-3 text-center border">
                    {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-3 text-center border">
                    <img
                      src={user.avatar || "https://via.placeholder.com/40"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full mx-auto object-cover"
                    />
                  </td>
                  <td className="p-3 text-center border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 text-center border">{user.phone || "—"}</td>
                  <td className="p-3 text-center border">
                    {currentUser?.role === "admin" ? (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value as IUser["role"])
                        }
                        className="bg-white border rounded px-2 py-1 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="capitalize">{user.role}</span>
                    )}
                  </td>
                  <td className="p-3 text-center border">
                    {user.isActive ? (
                      <span className="text-green-600 font-medium">Hoạt động</span>
                    ) : (
                      <span className="text-gray-500 italic">Không hoạt động</span>
                    )}
                  </td>
                  {currentUser?.role === "admin" && (
                    <td className="p-3 text-center border">
                      {user.isActive && (
                        <button
                          onClick={() => handleHide(user._id)}
                          className="flex items-center justify-center gap-1 text-red-500 hover:text-red-700 font-medium"
                        >
                          <EyeOff size={16} /> Vô hiệu hóa
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 italic text-gray-500">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="text-2xl text-rose-600 hover:text-rose-800 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ◀
        </button>
        <span className="font-semibold text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="text-2xl text-rose-600 hover:text-rose-800 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ▶️
        </button>
      </div>
    </div>
  );
};

export default UserList;
