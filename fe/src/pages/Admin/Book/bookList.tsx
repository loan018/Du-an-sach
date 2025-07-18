import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { getAllBooks, deleteBook } from "../../../services/bookService";
import { IBook } from "../../../interface/book";

const BOOKS_PER_PAGE = 10;

const BookList: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [currentPage, search, statusFilter]);

  const fetchBooks = async () => {
    try {
      const query: any = {
        page: currentPage,
        limit: BOOKS_PER_PAGE,
      };

      if (search.trim()) query.search = search.trim();
      if (statusFilter !== "all") query.isActive = statusFilter === "true";

      const res = await getAllBooks(query);
      setBooks(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách sách:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá sách này?");
    if (!confirm) return;
    try {
      await deleteBook(id);
      alert("✅ Xoá sách thành công!");
      fetchBooks();
    } catch (error) {
      console.error("Lỗi khi xoá sách:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-violet-700 flex items-center justify-center gap-2">
        Quản lý Sách
      </h1>

      {/* Bộ lọc */}
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm tiêu đề..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-72 shadow-sm"
        />

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-4 py-2 rounded-md shadow-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="true">Hiển thị</option>
            <option value="false">Ẩn</option>
          </select>

          <button
            onClick={() => navigate("/admin/book/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            ➕ Thêm Sách
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-gray-400 shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-violet-200 text-violet-900 font-semibold text-center">
              <th className="p-3 border">STT</th>
              <th className="p-3 border">Tiêu đề</th>
              <th className="p-3 border">Ảnh</th>
              <th className="p-3 border">Tác giả</th>
              <th className="p-3 border">Giá gốc</th>
              <th className="p-3 border">Giá</th>
              <th className="p-3 border">Danh mục</th>
              <th className="p-3 border">Số lượng</th>
              <th className="p-3 border">Đã bán</th>
              <th className="p-3 border">Mô tả</th>
              <th className="p-3 border">Trạng thái</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody className="border-t border-b border-gray-400 text-center">
            {books.length > 0 ? (
              books.map((book, index) => (
                <tr key={book._id} className="hover:bg-violet-50 transition">
                  <td className="p-3 border">
                    {(currentPage - 1) * BOOKS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-3 border">{book.title}</td>
                  <td className="p-3 border">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-14 h-14 object-cover mx-auto"
                    />
                  </td>
                  <td className="p-3 border">{book.author}</td>
                  <td className="p-3 border text-gray-500 line-through">
                    {book.oldPrice && book.oldPrice > 0
                      ? `${book.oldPrice.toLocaleString()}₫`
                      : "—"}
                  </td>
                  <td className="p-3 border text-red-600 font-semibold">
                    {book.price.toLocaleString()}₫
                  </td>
                  <td className="p-3 border">
                    {typeof book.category === "object" && book.category
                      ? (book.category as any).name
                      : book.category}
                  </td>
                  <td className="p-3 border">{book.quantity}</td>
                  <td className="p-3 border">{book.sold ?? 0}</td>
                  <td
                    className="p-3 border max-w-xs truncate"
                    title={book.description}
                  >
                    {book.description || "—"}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        book.isActive
                          ? "text-green-600 font-medium"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {book.isActive ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => navigate(`/admin/book/edit/${book._id}`)}
                        className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                      >
                        <Pencil size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(book._id!)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-gray-500 italic p-6">
                  Không có sách nào.
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

export default BookList;
