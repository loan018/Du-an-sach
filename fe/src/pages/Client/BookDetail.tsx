import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById, getRelatedBooks } from "../../services/bookService";
import { getReviewsByBook } from "../../services/reviewService";
import { addToCart } from "../../services/cartService";
import { IBook } from "../../interface/book";
import { IReview } from "../../interface/review";
import { useCart } from "../../contexts/CartContext";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<IBook | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<IBook[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBookById(id!);
        setBook(res.data);

        const related = await getRelatedBooks(id!);
        setRelatedBooks(related);

        const reviewRes = await getReviewsByBook(id!);
        setReviews(reviewRes || []);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const handleAddToCart = async () => {
    if (!book) return;
    try {
      await addToCart(book._id!, quantity);
      await refreshCart();
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      alert("Không thể thêm vào giỏ hàng");
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!book)
    return (
      <div className="text-center text-red-500">Không tìm thấy sản phẩm</div>
    );

  return (
    <div className="bg-white px-4 md:px-10 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Hình ảnh */}
        <div className="flex justify-center">
          <img
            src={book.image}
            alt={book.title}
            className="w-full max-w-md rounded-lg shadow-md object-contain"
          />
        </div>

        {/* Thông tin sách */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>

          <div className="text-gray-600 space-y-1 text-sm">
            <p>
              <strong>Tác giả:</strong> {book.author}
            </p>
            {book.category && (
              <p>
                <strong>Danh mục:</strong>{" "}
                {typeof book.category === "object" && book.category
                  ? (book.category as any).name
                  : book.category}
              </p>
            )}
            {avgRating && (
              <p className="text-yellow-500 font-medium">⭐ {avgRating}/5</p>
            )}
            <p>
              Đã bán: {book.sold || 0} | Còn lại: {book.quantity}
            </p>
          </div>

          <div className="space-x-3 mt-3">
            {book.oldPrice && (
              <span className="text-gray-400 line-through text-lg">
                {book.oldPrice.toLocaleString()}₫
              </span>
            )}
            <span className="text-red-500 text-2xl font-bold">
              {book.price.toLocaleString()}₫
            </span>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <span className="font-medium">Số lượng</span>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 border rounded text-lg"
            >
              −
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 border rounded text-lg"
            >
              +
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition w-full md:w-auto"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={() => {
                if (!book) return;

                const checkoutItems = [
                  {
                    _id: book._id,
                    book: book,
                    quantity: quantity,
                  },
                ];

                localStorage.setItem(
                  "checkout_items",
                  JSON.stringify(checkoutItems)
                );
                navigate("/checkout");
              }}
              className="border border-red-500 text-red-500 px-6 py-3 rounded-md hover:bg-red-50 transition w-full md:w-auto"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div className="mt-12 border-t pt-6">
        <h2 className="text-xl font-bold mb-3 text-gray-800">Mô tả sản phẩm</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {book.description || "Chưa có mô tả."}
        </p>
      </div>

      {/* Đánh giá */}
      {reviews.length > 0 && (
        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Đánh giá người dùng
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border p-4 rounded-md bg-gray-50"
              >
                <div className="flex justify-between">
                  {typeof review.user !== "string" && (
                    <span className="font-medium text-gray-800">
                      {review.user.name}
                    </span>
                  )}
                  <span className="text-yellow-500">★ {review.rating}/5</span>
                </div>
                <p className="text-gray-700 mt-2 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sản phẩm tương tự */}
      {relatedBooks.length > 0 && (
        <div className="mt-16 border-t pt-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Sản phẩm tương tự
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {relatedBooks.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-3 hover:shadow-md cursor-pointer bg-white"
                onClick={() => navigate(`/book/${item._id}`)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-32 w-full object-contain rounded mb-2"
                />
                <h3 className="text-sm font-medium line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-red-500 font-semibold text-sm mt-1">
                  {item.price.toLocaleString()}₫
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
