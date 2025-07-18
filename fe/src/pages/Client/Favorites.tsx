import React, { useEffect, useState } from "react";
import { IBook } from "../../interface/book";
import { useFavorite } from "../../contexts/FavoriteContext";
import { getAllBooks } from "../../services/bookService";
import { useNavigate } from "react-router-dom";

const Favorites: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<IBook[]>([]);
  const { favorites, removeFromFavorites } = useFavorite();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const allBooks = await getAllBooks({ page: 1, limit: 1000 });
        const books = allBooks.data || [];

        // Lọc ra các sách có ID nằm trong danh sách yêu thích
        const filtered = books.filter((book: IBook) =>
          favorites.includes(book._id!)
        );
        setFavoriteBooks(filtered);
      } catch (err) {
        console.error("Lỗi khi tải sách yêu thích:", err);
      }
    };

    fetchFavoriteBooks();
  }, [favorites]);

  return (
    <div className="bg-white min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Danh sách yêu thích</h1>

        {favoriteBooks.length === 0 ? (
          <p className="text-gray-600">
            Bạn chưa thêm sách nào vào danh sách yêu thích.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favoriteBooks.map((book) => (
              <div
                key={book._id}
                className="border rounded-lg shadow-sm p-4 flex gap-4"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-24 h-32 object-cover rounded"
                />
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-semibold">{book.title}</h2>
                    <p className="text-gray-600">Tác giả: {book.author}</p>
                    <p className="text-red-500 font-bold mt-1">
                      {book.price.toLocaleString()}đ
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition text-sm"
                      onClick={() => navigate(`/book/${book._id}`)}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 transition text-sm"
                      onClick={() => removeFromFavorites(book._id!)}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
