import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import { IOrder } from "../../interface/order";

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id!);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order)
    return <div className="text-center py-10">Đang tải đơn hàng...</div>;

  // Mapping trạng thái đơn hàng
  const statusMap: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirming: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>

      {/* Trạng thái đơn hàng */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        {/* Mã đơn hàng */}
        <p className="text-sm text-gray-500">Mã đơn: {order.orderCode}</p>

        {/* Trạng thái đơn hàng */}
        <div className="mt-2 md:mt-0 p-2 rounded-md bg-yellow-50 border border-yellow-300 text-yellow-800 font-semibold">
          Trạng thái: {statusMap[order.status]}
        </div>
      </div>

      {/* Thông tin người nhận */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Thông tin người nhận</h3>
        <div className="space-y-1 text-gray-700">
          <p>Họ tên: {order.shippingInfo.name}</p>
          <p>SĐT: {order.shippingInfo.phone}</p>
          <p>Địa chỉ: {order.shippingInfo.address}</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        {order.items.map((item) => (
          <div
            key={item.book._id}
            className="flex items-center gap-4 p-4 border-b last:border-none"
          >
            <img
              src={item.book.image}
              alt={item.book.title}
              className="w-20 h-24 object-cover rounded border"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.book.title}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} x {item.price.toLocaleString()}₫
              </p>
            </div>
            <div className="text-right font-semibold text-red-600">
              {(item.price * item.quantity).toLocaleString()}₫
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-md border text-sm text-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Bên trái: Trạng thái thanh toán nằm trên phương thức */}
          <div className="md:w-2/3 flex flex-col sm:flex-row sm:items-start gap-4">
            <div>
              <p>
                Trạng thái thanh toán:{" "}
                <span
                  className={`font-medium ${
                    order.isPaid ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {order.isPaid
                    ? `Đã thanh toán (${new Date(
                        order.paidAt!
                      ).toLocaleString()})`
                    : "Chưa thanh toán"}
                </span>
              </p>
              <p className="mt-1">
                Phương thức thanh toán:{" "}
                <span className="font-medium">
                  {order.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : "Ví MoMo"}
                </span>
              </p>
            </div>
          </div>

          {/* Bên phải: Tổng thanh toán */}
          <div className="md:w-1/3 text-right">
            <p className="text-lg font-bold text-red-600">
              Tổng thanh toán: {order.totalAmount.toLocaleString()}₫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
