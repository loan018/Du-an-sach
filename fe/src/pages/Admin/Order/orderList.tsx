import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../../services/orderService";
import { IOrder } from "../../../interface/order";
import {  Pencil } from "lucide-react";

const ORDERS_PER_PAGE = 10;

const renderStatus = (status: string) => {
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "text-green-700";
    case "cancelled":
      return "text-red-600";
    case "pending":
    case "confirming":
    case "shipping":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, search, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query: any = {
        page: currentPage,
        limit: ORDERS_PER_PAGE,
      };

      if (search.trim()) query.search = search.trim();
      if (statusFilter !== "all") query.status = statusFilter;

      const res = await getAllOrders(query);
      setOrders(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("❌ Lỗi khi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-700 flex items-center justify-center gap-2">
      Quản lý Đơn hàng
      </h1>

      {/* Bộ lọc */}
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên người nhận..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-72 shadow-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded-md shadow-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirming">Đang xử lý</option>
          <option value="shipping">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-gray-400 shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-teal-200 text-teal-900 font-semibold text-center">
              <th className="p-3 border">STT</th>
              <th className="p-3 border">Người nhận</th>
              <th className="p-3 border">SĐT</th>
              <th className="p-3 border">Địa chỉ</th>
              <th className="p-3 border">Tổng tiền</th>
              <th className="p-3 border">Thanh toán</th>
              <th className="p-3 border">Trạng thái</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody className="border-t border-b border-gray-400 text-center">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-6 italic text-gray-500">
                  Đang tải đơn hàng...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 italic text-gray-500">
                  Không có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-teal-50 transition">
                  <td className="p-3 border">
                    {(currentPage - 1) * ORDERS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-3 border">{order.shippingInfo.name}</td>
                  <td className="p-3 border">{order.shippingInfo.phone}</td>
                  <td className="p-3 border">{order.shippingInfo.address}</td>
                  <td className="p-3 border text-right pr-4">
                    {order.totalAmount.toLocaleString()}₫
                  </td>
                  <td className="p-3 border uppercase">{order.paymentMethod}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      {renderStatus(order.status)}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => navigate(`/admin/order/${order._id}`)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Pencil size={16} /> Chi tiết
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
          className="text-2xl text-teal-600 hover:text-teal-800 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ◀
        </button>
        <span className="font-semibold text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="text-2xl text-teal-600 hover:text-teal-800 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ▶️
        </button>
      </div>
    </div>
  );
};

export default OrderList;
