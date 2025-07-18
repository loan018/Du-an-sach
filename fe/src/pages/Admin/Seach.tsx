import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchAdminData } from "../../services/bellService";
import { IBook } from "../../interface/book";
import { IUser } from "../../interface/auth";
import { ICategory } from "../../interface/category";
import { IReview } from "../../interface/review";
import { Pencil, Trash2, EyeOff } from "lucide-react";
import { deleteBook } from "../../services/bookService";
import { deleteCategory } from "../../services/categoryService";
import { hideUser } from "../../services/authService";
import { hideReview } from "../../services/reviewService";
import { useAuth } from "../../hooks/Admin/useAuth";

interface ResultItem {
  type: "user" | "book" | "category" | "review";
  id: string;
  data: IUser | IBook | ICategory | IReview;
}

const AdminSearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // lấy user hiện tại
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim()) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          const res = await searchAdminData(query);
          setResults(res.data?.results || []);
        } catch (err: any) {
          setError(err.response?.data?.message || "Lỗi tìm kiếm");
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [query]);

  const handleDeleteItem = async (type: string, id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá không?")) return;

    try {
      if (type === "book") await deleteBook(id);
      if (type === "category") await deleteCategory(id);

      setResults((prev) =>
        prev.filter((item) => !(item.type === type && item.id === id))
      );
      alert("✅ Xoá thành công!");
    } catch (error) {
      console.error("❌ Lỗi xoá:", error);
      alert("Xoá thất bại!");
    }
  };

  const handleHideItem = async (id: string, type: "user" | "review") => {
    if (type === "user" && currentUser?.role !== "admin") {
      alert("❌ Bạn không có quyền vô hiệu hoá người dùng!");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn ẩn mục này không?")) return;

    try {
      if (type === "user") await hideUser(id);
      if (type === "review") await hideReview(id);

      setResults((prev) =>
        prev.map((item) =>
          item.id === id && item.type === type
            ? { ...item, data: { ...item.data, isActive: false } }
            : item
        )
      );
      alert("✅ Đã ẩn thành công.");
    } catch (error) {
      console.error("❌ Lỗi khi ẩn:", error);
      alert("Ẩn thất bại!");
    }
  };

  const renderActions = (item: ResultItem) => {
    const { type, id, data } = item;
    const isActive = (data as any).isActive;

    if (type === "book" || type === "category") {
      return (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => navigate(`/admin/${type}/edit/${id}`)}
            className="text-yellow-600 hover:text-yellow-800 flex gap-1"
          >
            <Pencil size={16} /> Sửa
          </button>
          <button
            onClick={() => handleDeleteItem(type, id)}
            className="text-red-600 hover:text-red-800 flex gap-1"
          >
            <Trash2 size={16} /> Xoá
          </button>
        </div>
      );
    }

    if ((type === "user" || type === "review") && isActive) {
      return (
        <button
          onClick={() => handleHideItem(id, type)}
          className="text-red-500 hover:text-red-700 flex gap-1 justify-center"
        >
          <EyeOff size={16} /> Ẩn
        </button>
      );
    }

    return null;
  };

  const groupResultsByType = () => {
    const grouped: Record<string, ResultItem[]> = {
      user: [],
      book: [],
      category: [],
      review: [],
    };
    results.forEach((item) => {
      grouped[item.type].push(item);
    });
    return grouped;
  };

  const groupedResults = groupResultsByType();

  const renderTableRow = (item: ResultItem, index: number) => {
    const data = item.data;
    switch (item.type) {
      case "user":
        const user = data as IUser;
        return (
          <tr key={user._id}>
            <td className="p-3 border">{index + 1}</td>
            <td className="p-3 border">{user.name}</td>
            <td className="p-3 border">{user.email}</td>
            <td className="p-3 border">{user.role}</td>
            <td
              className={`p-3 border font-medium text-sm ${
                user.isActive ? "text-green-600" : "text-gray-400"
              }`}
            >
              {user.isActive ? "Hoạt động" : "Không hoạt động"}
            </td>

            {currentUser?.role === "admin" && (
              <td className="p-3 border">{renderActions(item)}</td>
            )}
          </tr>
        );
      case "book":
        const book = data as IBook;
        return (
          <tr key={book._id}>
            <td className="p-3 border">{index + 1}</td>
            <td className="p-3 border">{book.title}</td>
            <td className="p-3 border">
              <img
                src={book.image}
                className="w-14 h-14 object-cover mx-auto"
              />
            </td>
            <td className="p-3 border">{book.author}</td>
            <td className="p-3 border">{book.price.toLocaleString()}₫</td>
            <td className="p-3 border">
              {typeof book.category === "object"
                ? book.category.name
                : book.category}
            </td>
            <td className="p-3 border">{book.quantity}</td>
            <td
              className="p-3 border max-w-xs truncate"
              title={book.description}
            >
              {book.description || "Không có"}
            </td>
            <td
              className={`p-3 border font-medium text-sm rounded ${
                book.isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 bg-gray-100"
              }`}
            >
              {book.isActive ? "Hiển thị" : "Ẩn"}
            </td>

            <td className="p-3 border">{renderActions(item)}</td>
          </tr>
        );
      case "category":
        const category = data as ICategory;
        return (
          <tr key={category._id}>
            <td className="p-3 border">{index + 1}</td>
            <td className="p-3 border">{category.name}</td>
            <td className="p-3 border">{category.description || "Không có"}</td>
            <td className="p-3 border">{category.slug}</td>
            <td className="p-3 border">{category.sortOrder}</td>
            <td
              className={`p-3 border font-medium text-sm rounded ${
                category.isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 bg-gray-100"
              }`}
            >
              {category.isActive ? "Hiển thị" : "Ẩn"}
            </td>

            <td className="p-3 border">{renderActions(item)}</td>
          </tr>
        );
      case "review":
        const review = data as IReview;
        return (
          <tr key={review._id}>
            <td className="p-3 border">{index + 1}</td>
            <td className="p-3 border">
              {typeof review.user === "object" ? review.user.name : review.user}
            </td>
            <td className="p-3 border">
              {typeof review.book === "object"
                ? review.book.title
                : review.book}
            </td>
            <td className="p-3 border">{review.rating} ⭐</td>
            <td className="p-3 border">{review.comment || "Không có"}</td>
            <td className="p-3 border">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleString()
                : "N/A"}
            </td>
            <td className="p-3 border">{renderActions(item)}</td>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableHead = (type: string) => {
    switch (type) {
      case "user":
        return (
          <>
            <th className="p-3 border">STT</th>
            <th className="p-3 border">Họ tên</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Vai trò</th>
            <th className="p-3 border">Trạng thái</th>
            {currentUser?.role === "admin" && (
              <th className="p-3 border">Hành động</th>
            )}
          </>
        );
      case "book":
        return (
          <>
            <th className="p-3 border">STT</th>
            <th className="p-3 border">Tiêu đề</th>
            <th className="p-3 border">Ảnh</th>
            <th className="p-3 border">Tác giả</th>
            <th className="p-3 border">Giá</th>
            <th className="p-3 border">Danh mục</th>
            <th className="p-3 border">Số lượng</th>
            <th className="p-3 border">Mô tả</th>
            <th className="p-3 border">Trạng thái</th>
            <th className="p-3 border">Hành động</th>
          </>
        );
      case "category":
        return (
          <>
            <th className="p-3 border">STT</th>
            <th className="p-3 border">Tên</th>
            <th className="p-3 border">Mô tả</th>
            <th className="p-3 border">Slug</th>
            <th className="p-3 border">Thứ tự</th>
            <th className="p-3 border">Trạng thái</th>
            <th className="p-3 border">Hành động</th>
          </>
        );
      case "review":
        return (
          <>
            <th className="p-3 border">STT</th>
            <th className="p-3 border">Người dùng</th>
            <th className="p-3 border">Sách</th>
            <th className="p-3 border">Sao</th>
            <th className="p-3 border">Bình luận</th>
            <th className="p-3 border">Thời gian</th>
            <th className="p-3 border">Hành động</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderSection = (type: keyof typeof groupedResults, title: string) => {
    const items = groupedResults[type];
    if (items.length === 0) return null;
    return (
      <div key={type} className="mb-10">
        <h3 className="text-xl font-bold text-rose-600 mb-2">{title}</h3>
        <div className="overflow-auto bg-white rounded shadow border">
          <table className="w-full table-auto text-sm text-gray-800">
            <thead>
              <tr className="bg-pink-200 text-rose-800 font-semibold text-center">
                {renderTableHead(type)}
              </tr>
            </thead>
            <tbody className="text-center">
              {items.map((item, index) => renderTableRow(item, index))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-rose-700">
        Kết quả tìm kiếm cho: "{query}"
      </h2>
      {loading && <p>Đang tìm kiếm...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && results.length === 0 && (
        <p className="text-gray-600 italic">Không tìm thấy kết quả.</p>
      )}
      {!loading && results.length > 0 && (
        <>
          {renderSection("user", "Tài Khoản")}
          {renderSection("book", "Sách")}
          {renderSection("category", "Danh mục")}
          {renderSection("review", "Đánh giá")}
        </>
      )}
    </div>
  );
};

export default AdminSearchResult;
