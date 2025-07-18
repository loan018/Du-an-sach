import axios from "../utils/axios";

// Tổng doanh thu

export const getTotalRevenue = async (
  year?: number
): Promise<{
  success: boolean;
  totalRevenue: number;
}> => {
  const res = await axios.get("/api/stats/revenue/total", {
    params: year ? { year } : {},
  });
  return res.data;
};


// Doanh thu theo tuần
export const getMonthlyRevenue = async (): Promise<{
  success: boolean;
  data: {
    day: string;
    totalRevenue: number;
    orderCount: number;
  }[];
}> => {
  const res = await axios.get("/api/stats/revenue/weekly");
  return res.data;
};

// Thống kê trạng thái đơn hàng
export const getOrderStats = async (): Promise<{
  success: boolean;
  data: Record<string, number>;
}> => {
  const res = await axios.get("/api/stats/orders/stats");
  return res.data;
};

// Top 5 sách bán chạy
export const getTopBooks = async (): Promise<{
  success: boolean;
  data: {
    title: string;
    totalSold: number;
  }[];
}> => {
  const res = await axios.get("/api/stats/books/top");
  return res.data;
};
