import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchBooks } from "../../services/bookService";
import { IBook } from "../../interface/book";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // 👈 Thêm navigate

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setKeyword(query);
    if (query.trim()) {
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (value?: string) => {
    const searchTerm = (value ?? keyword).trim();
    if (!searchTerm) return;

    setLoading(true);
    try {
      const res = await searchBooks(searchTerm);
      setResults(res);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Kết quả tìm kiếm {keyword && `cho: "${keyword}"`}
        </h1>

        {loading ? (
          <p className="text-gray-500">Đang tìm kiếm...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-600 italic">Không tìm thấy kết quả phù hợp.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((book) => (
              <div
                key={book._id}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/book/${book._id}`)} // 👈 Xử lý khi click
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h2 className="text-base font-medium line-clamp-2 mb-1 text-gray-800">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500 mb-1">Tác giả: {book.author}</p>
                <div className="text-red-600 font-bold text-base">
                  {book.price.toLocaleString()}đ
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
