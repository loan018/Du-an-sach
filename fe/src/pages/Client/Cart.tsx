import React, { useEffect, useState } from "react";
import { IBook } from "../../interface/book";
import {
  updateCartItem,
  removeCartItem,
} from "../../services/cartService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

interface CartItem {
  _id: string;
  book: IBook | null;
  quantity: number;
  selected?: boolean;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const { cartItems: contextCart, refreshCart } = useCart();

  // Check đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để xem giỏ hàng.");
      navigate("/login");
    }
  }, [navigate]);

  // Đồng bộ cart từ context
  useEffect(() => {
    setCartItems((prev) =>
      contextCart.map((item) => {
        const oldItem = prev.find((i) => i._id === item._id);
        return {
          ...item,
          selected: oldItem?.selected ?? false,
        };
      })
    );
  }, [contextCart]);

  const handleQuantityChange = async (bookId: string, quantity: number) => {
    const item = cartItems.find((i) => i.book?._id === bookId);
    if (!item || !item.book) return;

    const stock = item.book.quantity;

    if (quantity < 1) {
      const confirmDelete = confirm(
        `Bạn có muốn xoá "${item.book.title}" khỏi giỏ hàng không?`
      );
      if (confirmDelete) await handleRemove(item.book._id);
      return;
    }

    if (quantity > stock) {
      alert(`⚠️ Sách "${item.book.title}" chỉ còn lại ${stock} cuốn.`);
      return;
    }

    try {
      await updateCartItem(bookId, quantity);
      refreshCart();
    } catch (err) {
      console.error("Cập nhật lỗi:", err);
    }
  };

  const handleRemove = async (bookId: string) => {
    try {
      await removeCartItem(bookId);
      refreshCart();
    } catch (err) {
      console.error("Lỗi xoá:", err);
    }
  };

  const handleClearSelected = async () => {
    const selectedItems = cartItems.filter((i) => i.selected && i.book);
    if (!selectedItems.length) return;

    const confirmDelete = confirm(
      `❗Xoá ${selectedItems.length} sản phẩm đã chọn khỏi giỏ hàng?`
    );
    if (!confirmDelete) return;

    for (const item of selectedItems) {
      await removeCartItem(item.book!._id);
    }

    refreshCart();
    setSelectAll(false);
  };

  const toggleSelectAll = () => {
    const newSelect = !selectAll;
    setSelectAll(newSelect);
    setCartItems((prev) => prev.map((i) => ({ ...i, selected: newSelect })));
  };

  const handleSelectOne = (id: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, selected: !i.selected } : i))
    );
  };

  const total = cartItems
    .filter((i) => i.selected && i.book)
    .reduce((sum, i) => sum + i.book!.price * i.quantity, 0);

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((i) => i.selected && i.book);
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để đặt hàng");
      return;
    }
    localStorage.setItem("checkout_items", JSON.stringify(selectedItems));
    navigate("/checkout");
  };

  return (
    <div className="bg-white min-h-screen px-2 sm:px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Giỏ hàng của bạn
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">
            Giỏ hàng của bạn đang trống.
          </p>
        ) : (
          <>
            {/* Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 font-medium text-sm text-gray-700 border-y">
              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
                <span>Sản phẩm</span>
              </div>
              <div>Giá</div>
              <div>Số lượng</div>
              <div>Thành tiền</div>
              <div>Thao tác</div>
            </div>

            {/* Items */}
            <div className="divide-y">
              {cartItems.map(({ _id, book, quantity, selected }) => (
                <div
                  key={_id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 px-2 sm:px-4 py-4 items-center"
                >
                  <div className="flex items-center gap-3 col-span-2">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleSelectOne(_id)}
                    />
                    <div
                      className="flex gap-3 items-start cursor-pointer hover:bg-gray-50 rounded p-1 transition"
                      onClick={() => book && navigate(`/book/${book._id}`)}
                    >
                      <img
                        src={book?.image || "/no-image.jpg"}
                        alt={book?.title || "Không có tên"}
                        className="w-16 h-20 object-cover rounded border"
                      />
                      <div>
                        <p className="text-sm font-semibold line-clamp-2">
                          {book?.title || "[Không xác định]"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tác giả: {book?.author || "?"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Kho: {book?.quantity ?? "?"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700">
                    {book?.price?.toLocaleString() || 0}₫
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        book && handleQuantityChange(book._id, quantity - 1)
                      }
                      className="px-2 border rounded-l bg-gray-100 hover:bg-gray-200"
                      disabled={!book}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        book &&
                        handleQuantityChange(book._id, Number(e.target.value))
                      }
                      className="w-12 text-center border-t border-b"
                      disabled={!book}
                    />
                    <button
                      onClick={() =>
                        book && handleQuantityChange(book._id, quantity + 1)
                      }
                      className="px-2 border rounded-r bg-gray-100 hover:bg-gray-200"
                      disabled={!book}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-red-600">
                    {(book?.price ? book.price * quantity : 0).toLocaleString()}
                    ₫
                  </div>

                  <div>
                    <button
                      onClick={() => book && handleRemove(book._id)}
                      className="text-sm text-red-500 hover:underline"
                      disabled={!book}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng và hành động */}
            <div className="mt-8 p-4 border-t">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleClearSelected}
                  disabled={!cartItems.some((i) => i.selected)}
                  className="bg-gray-100 text-red-600 px-4 py-2 rounded border border-red-300 hover:bg-red-50 disabled:opacity-50"
                >
                  Xoá sản phẩm đã chọn
                </button>

                <div className="flex items-center gap-4">
                  <p className="text-lg font-semibold">
                    Tổng:{" "}
                    <span className="text-red-600">
                      {total.toLocaleString()}₫
                    </span>
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={total === 0}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Đặt hàng
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
