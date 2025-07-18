import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import { IOrder } from "../../interface/order";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

// Tabs trạng thái
const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đã xác nhận", value: "confirming" },
  { label: "Vận chuyển", value: "shipping" },
  { label: "Hoàn thành", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

// Format ngày
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleString("vi-VN");
};

const Order: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const handleRepeatOrder = async (items: IOrder["items"]) => {
    try {
      for (const item of items) {
        await addToCart(item.book._id, item.quantity);
      }
      navigate("/cart");
    } catch (err) {
      console.error("Mua lại thất bại", err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Đơn mua</h2>

      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-2 text-sm font-medium border-b-2 ${
              activeTab === tab.value
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-orange-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Không có đơn hàng nào.
        </p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="border rounded-md shadow-sm p-4">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <div className="text-sm text-gray-600">
                  Mã đơn: {" "}
                  <span className="font-semibold text-gray-800">
                    {order.orderCode}
                  </span>
                </div>
                <div
                  className={`text-sm font-semibold capitalize ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "cancelled"
                      ? "text-gray-500"
                      : "text-orange-600"
                  }`}
                >
                  {order.status === "pending"
                    ? "Chờ xác nhận"
                    : order.status === "confirming"
                    ? "Đã xác nhận"
                    : order.status === "shipping"
                    ? "Vận chuyển"
                    : order.status === "delivered"
                    ? "Hoàn thành"
                    : "Đã hủy"}
                </div>
              </div>

              {/* Items */}
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 mb-3 border-b pb-3 last:border-none last:pb-0"
                >
                  <img
                    src={item.book?.image}
                    alt={item.book?.title}
                    className="w-16 h-20 object-cover border rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.book?.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-red-600 font-semibold text-sm">
                    ₫{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  Ngày đặt: {formatDate(order.createdAt)}
                </span>
                <div>
                  <span className="mr-2 text-sm text-gray-700">Tổng tiền:</span>
                  <span className="text-lg text-red-600 font-bold">
                    ₫{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                {order.status === "cancelled" ? (
                  <>
                    <button
                      onClick={() => handleRepeatOrder(order.items)}
                      className="px-4 py-1.5 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50"
                    >
                      Mua lại
                    </button>
                    <Link
                      to={`/order/${order._id}`}
                      className="px-4 py-1.5 text-sm border text-gray-600 rounded hover:bg-gray-50"
                    >
                      Xem chi tiết hủy
                    </Link>
                  </>
                ) : (
                  <Link
                    to={`/order/${order._id}`}
                    className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Xem chi tiết
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
