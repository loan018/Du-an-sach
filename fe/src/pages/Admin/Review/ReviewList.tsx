import React, { useEffect, useState } from "react";
import { getReviewsBook, hideReview } from "../../../services/reviewService";
import { getAllBooks } from "../../../services/bookService";
import { IReview } from "../../../interface/review";
import { IBook } from "../../../interface/book";
import { Star, EyeOff } from "lucide-react";

const REVIEWS_PER_PAGE = 10;

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [selectedBook, setSelectedBook] = useState("all");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Lấy tất cả sách
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getAllBooks();
        setBooks(res.data || []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sách:", error);
      }
    };
    fetchBooks();
  }, []);

  // Lấy đánh giá
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: REVIEWS_PER_PAGE,
      };

      if (search.trim()) params.search = search.trim();
      if (ratingFilter !== "all") params.rating = ratingFilter;
      if (selectedBook !== "all") params.id = selectedBook;

      const res = await getReviewsBook(params);
      setReviews(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error("❌ Lỗi khi lấy đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [search, ratingFilter, selectedBook, currentPage]);

  const handleHide = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn ẩn đánh giá này?")) return;
    try {
      await hideReview(id);
      fetchReviews();
    } catch (err) {
      alert("Ẩn đánh giá thất bại");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700 flex items-center justify-center gap-2">
       Danh sách Đánh giá & Bình luận
      </h1>

      {/* Bộ lọc */}
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên người dùng..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2 w-72"
        />
        <div>
        <select
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded"
        >
          <option value="all">Tất cả sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>

        <select
          value={selectedBook}
          onChange={(e) => {
            setSelectedBook(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-72"
        >
          <option value="all">Tất cả sách</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title}
            </option>
          ))}
        </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-gray-300 shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-purple-200 text-purple-900 text-center font-semibold">
              <th className="p-2 border">STT</th>
              <th className="p-2 border">Người dùng</th>
              <th className="p-2 border">Sách</th>
              <th className="p-2 border">Sao</th>
              <th className="p-2 border">Bình luận</th>
              <th className="p-2 border">Thời gian</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 italic">
                  Đang tải đánh giá...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 italic">
                  Không có đánh giá nào
                </td>
              </tr>
            ) : (
              reviews.map((r, idx) => (
                <tr key={r._id} className="text-center hover:bg-purple-50">
                  <td className="p-2 border">
                    {(currentPage - 1) * REVIEWS_PER_PAGE + idx + 1}
                  </td>
                  <td className="p-2 border">
                    {typeof r.user === "string" ? r.user : r.user?.name}
                  </td>
                  <td className="p-2 border">
                    {typeof r.book === "string" ? r.book : r.book?.title}
                  </td>
                  <td className="p-2 border">{r.rating}⭐</td>
                  <td className="p-2 border">{r.comment || "Không có"}</td>
                  <td className="p-2 border">
                    {new Date(r.createdAt!).toLocaleString()}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleHide(r._id!)}
                      className="text-red-500 hover:text-red-700 flex items-center justify-center gap-1"
                    >
                      <EyeOff size={16} /> Ẩn
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="text-2xl text-purple-600 hover:text-purple-800 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ◀
        </button>
        <span className="font-semibold text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="text-2xl text-purple-600 hover:text-purple-800 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
