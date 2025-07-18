import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBanners } from "../../services/bannerService";
import { getAllBooks } from "../../services/bookService";
import { getAllCategories } from "../../services/categoryService";
import { IBanner } from "../../interface/banner";
import { IBook } from "../../interface/book";
import { ICategory } from "../../interface/category";
import { useFavorite } from "../../contexts/FavoriteContext";
import { Heart } from "lucide-react";

const Home: React.FC = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorite();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bannerData = await getAllBanners();
      console.log(bannerData);

      setBanners(bannerData.filter((b) => b.isActive));

      const bookData = await getAllBooks({ page: 1, limit: 15 });
      setBooks(bookData.data || []);

      const categoryData = await getAllCategories({ page: 1, limit: 15 });
      setCategories(categoryData.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu trang chủ:", error);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const handleToggleFavorite = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (isFavorite(bookId)) {
      await removeFromFavorites(bookId);
    } else {
      await addToFavorites(bookId);
    }
  };

  return (
    <>
      {/* Banner */}
      <section className="relative w-full h-[450px] overflow-hidden rounded-b-3xl shadow">
        {banners.length > 0 ? (
          <Link to="book?category=thieu-nhi">
            <img
              src={banners[0].image}
              alt={banners[0].title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-4xl md:text-5xl font-bold drop-shadow mb-2">
                Khám phá Bộ Sưu Tập
              </h2>
              <p className="text-lg md:text-xl text-gray-200">
                Đọc sách - Giá hợp lý
              </p>
            </div>
          </Link>
        ) : (
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white flex items-center justify-center h-full">
            <h2 className="text-3xl font-semibold">Banner đang cập nhật...</h2>
          </div>
        )}
      </section>

      {/* Danh mục */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-6 text-rose-700 text-center uppercase tracking-wide">
          Danh mục nổi bật
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/book?category=${category.slug}`)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 shadow hover:shadow-md transition">
                <img
                  src={category.image || "/default-category.png"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-2 text-sm font-medium text-center text-gray-700">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Sản phẩm mới */}
      <main className="max-w-7xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-6 text-rose-700 text-center uppercase tracking-wide">
          Sản phẩm mới
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              onClick={() => navigate(`/book/${book._id}`)}
              className="bg-white rounded-xl shadow hover:shadow-xl border border-gray-200 overflow-hidden group cursor-pointer relative"
            >
              <div className="relative">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-60 object-cover"
                />
                <button
                  onClick={(e) => handleToggleFavorite(e, book._id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-rose-100 transition z-10"
                >
                  <Heart
                    size={20}
                    fill={isFavorite(book._id) ? "#e11d48" : "none"}
                    stroke="#e11d48"
                  />
                </button>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-500 truncate mb-1">
                  {book.author}
                </p>
                <div className="text-rose-600 font-bold text-base">
                  {book.price.toLocaleString()}₫
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
