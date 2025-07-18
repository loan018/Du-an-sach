import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
} from "../../../services/orderService";
import { IOrder, OrderStatus } from "../../../interface/order";

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderById(id!);
      setOrder(res);
      setStatus(res.status);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!id || !status) return;
    try {
      await updateOrderStatus(id, status);
      alert("✅ Cập nhật trạng thái thành công");
      fetchOrder();
    } catch (err) {
      alert("❌ Cập nhật thất bại",);
    }
  };

  if (loading || !order)
    return (
      <p className="text-center text-gray-500 italic">Đang tải đơn hàng...</p>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
        Chi tiết đơn hàng
      </h2>

      {/* Thông tin chung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
        <div className="space-y-2">
          <p>
            <strong>Mã đơn hàng:</strong> {order.orderCode}
          </p>
          <p>
            <strong>Người nhận:</strong> {order.shippingInfo.name}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.shippingInfo.address}
          </p>
          <p>
            <strong>SĐT:</strong> {order.shippingInfo.phone}
          </p>
          <p>
            <strong>Ngày đặt hàng:</strong>{" "}
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Phương thức thanh toán:</strong>{" "}
            {order.paymentMethod.toUpperCase()}
          </p>
          <p>
            <strong>Đã thanh toán:</strong>{" "}
            <span
              className={
                order.isPaid ? "text-green-600 font-medium" : "text-red-500"
              }
            >
              {order.isPaid ? "Có" : "Chưa"}
            </span>
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={`font-semibold ${getStatusColor(order.status)}`}>
              {renderStatus(order.status)}
            </span>
          </p>
        </div>
      </div>

      {/* Chi tiết sản phẩm */}
      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 border">STT</th>
            <th className="p-2 border">Tên sách</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Số lượng</th>
            <th className="p-2 border">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">
                {typeof item.book === "string"
                  ? item.book
                  : (item.book as any)?.title || "Không rõ"}
              </td>
              <td className="p-2 border">{item.price.toLocaleString()}₫</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">
                {(item.price * item.quantity).toLocaleString()}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng tiền */}
      <p className="text-right text-lg font-bold text-gray-700 mb-6">
        Tổng tiền: {order.totalAmount.toLocaleString()}₫
      </p>

      {/* Nút hành động */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="border px-4 py-2 rounded shadow-sm"
            >
              <option value="pending">Chờ xác nhận</option>
              <option value="confirming">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã huỷ</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded shadow"
            >
              Cập nhật
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/admin/order")}
          className="text-gray-600 hover:underline ml-auto"
        >
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

// Hiển thị trạng thái tiếng Việt
const renderStatus = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "confirming":
      return "Đang xử lý";
    case "shipping":
      return "Đang giao";
    case "delivered":
      return "Đã giao";
    case "cancelled":
      return "Đã huỷ";
    default:
      return status;
  }
};

// Màu trạng thái
const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "text-yellow-600";
    case "confirming":
      return "text-blue-600";
    case "shipping":
      return "text-purple-600";
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export default OrderDetail;
