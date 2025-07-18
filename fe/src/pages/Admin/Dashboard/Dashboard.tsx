import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  getTotalRevenue,
  getMonthlyRevenue,
  getOrderStats,
  getTopBooks
} from "../../../services/dashboardService";
import { useAuth } from "../../../hooks/Admin/useAuth";

const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"];

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [orderStats, setOrderStats] = useState<any[]>([]);
  const [topBooks, setTopBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.role === "admin";
  const isStaff = currentUser?.role === "staff";

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dữ liệu chung cho Admin và Nhân viên
        const [ordersRes, booksRes] = await Promise.all([
          getOrderStats(),
          getTopBooks()
        ]);

        setOrderStats(
          Object.entries(ordersRes.data).map(([status, count]) => ({
            status,
            count: Number(count),
          }))
        );

        setTopBooks(booksRes.data || []);

        // Admin mới gọi doanh thu
        if (isAdmin) {
          const [revRes, monthRes] = await Promise.all([
            getTotalRevenue(currentYear),
            getMonthlyRevenue()
          ]);

          setTotalRevenue(revRes.totalRevenue || 0);

          setMonthlyRevenue(
            (monthRes.data || []).map((item: any) => ({
              month: item.month || item.day,
              totalRevenue: item.totalRevenue,
              orderCount: item.orderCount,
            }))
          );
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu thống kê:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (loading) return <div className="text-center py-10">Đang tải thống kê...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-rose-700">
        Thống kê hệ thống
      </h1>

      {/* Admin: Doanh thu theo tháng */}
      {isAdmin && (
        <div className="bg-white shadow rounded-xl p-4 mb-6">
          <h3 className="text-base font-medium text-gray-600 mb-2">Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 40000000]} tickFormatter={(v) => `${v / 1_000_000}tr`} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")} VNĐ`} />
              <Bar dataKey="totalRevenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Admin: Tổng doanh thu */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center mb-6 w-full md:w-1/3 mx-auto">
          <h3 className="text-base font-medium text-gray-600">
            Tổng doanh thu năm {currentYear}
          </h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {totalRevenue.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>
      )}

      {/* Cả Admin & Staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-base font-medium text-gray-600 mb-2">Trạng thái đơn hàng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStats}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {orderStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-base font-medium text-gray-600 mb-2">Top 5 sách bán chạy</h3>
          <ul className="divide-y divide-gray-200">
            {topBooks.map((book, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span className="text-gray-700">{book.title}</span>
                <span className="font-medium text-blue-600">
                  {book.totalSold} cuốn
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
