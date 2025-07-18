import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { getAllCategories, deleteCategory } from "../../../services/categoryService";
import { ICategory } from "../../../interface/category";

const CATEGORIES_PER_PAGE = 10;

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [currentPage, search, statusFilter]);

  const fetchCategories = async () => {
    try {
      const query: any = {
        page: currentPage,
        limit: CATEGORIES_PER_PAGE,
      };

      if (search.trim()) {
        query.search = search.trim();
      }

      if (statusFilter !== "all") {
        query.isActive = statusFilter === "true";
      }

      const data = await getAllCategories(query);
      setCategories(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách danh mục:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá danh mục này?");
    if (!confirm) return;
    try {
      await deleteCategory(id);
      alert("✅ Xoá danh mục thành công!");
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xoá danh mục:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-violet-700 flex items-center justify-center gap-2">
        Quản lý Danh Mục
      </h1>

      {/* Bộ lọc */}
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm tên danh mục..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-3 py-2 w-72 shadow-sm"
        />

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="border px-4 py-2 rounded-md shadow-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="true">Hiển thị</option>
            <option value="false">Ẩn</option>
          </select>

          <button
            onClick={() => navigate("/admin/category/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            ➕ Thêm Danh Mục
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-gray-400 shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-violet-200 text-violet-900 font-semibold text-center">
              <th className="p-3 border border-gray-400">STT</th>
              <th className="p-3 border border-gray-400">Hình ảnh</th>
              <th className="p-3 border border-gray-400">Tên</th>
              <th className="p-3 border border-gray-400">Mô tả</th>
              <th className="p-3 border border-gray-400">Slug</th>
              <th className="p-3 border border-gray-400">Thứ tự</th>
              <th className="p-3 border border-gray-400">Trạng thái</th>
              <th className="p-3 border border-gray-400">Hành động</th>
            </tr>
          </thead>
          <tbody className="border-t border-b border-gray-400 text-center">
            {categories.map((cat, index) => (
              <tr key={cat._id} className="hover:bg-violet-50 transition">
                <td className="p-3 border border-gray-300">
                  {(currentPage - 1) * CATEGORIES_PER_PAGE + index + 1}
                </td>
                <td className="p-3 border border-gray-300">
  <img
    src={cat.image || "/no-image.png"}
    alt={cat.name}
    className="w-12 h-12 object-cover mx-auto shadow"
  />
</td>

                <td className="p-3 border border-gray-300">{cat.name}</td>
                <td className="p-3 border border-gray-300">
                  {cat.description || "Không có"}
                </td>
                <td className="p-3 border border-gray-300">{cat.slug}</td>
                <td className="p-3 border border-gray-300">{cat.sortOrder}</td>
                <td className="p-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      cat.isActive
                        ? "text-green-600 font-medium"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {cat.isActive ? "Hiển thị" : "Ẩn"}
                  </span>
                </td>
                <td className="p-3 border border-gray-300">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate(`/admin/category/edit/${cat._id}`)}
                      className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                    >
                      <Pencil size={16} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id!)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={8} className="text-gray-500 italic p-6">
                  Không có danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="text-2xl text-violet-600 hover:text-violet-800 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ◀
        </button>
        <span className="font-semibold text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="text-2xl text-violet-600 hover:text-violet-800 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ▶️
        </button>
      </div>
    </div>
  );
};

export default CategoryList;
