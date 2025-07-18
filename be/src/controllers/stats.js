import Order from "../models/order.js";
import Book from "../models/books.js";

// Tổng doanh thu
export const getTotalRevenue = async (req, res) => {
  try {
    const { year } = req.query; 

    const matchStage = {
      $match: {
        $or: [
          { paymentMethod: "online", isPaid: true },
          { paymentMethod: "cod", status: "delivered" }
        ]
      }
    };

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${+year + 1}-01-01`);
      matchStage.$match.createdAt = { $gte: start, $lt: end };
    }

    const total = await Order.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      success: true,
      message: `Thống kê doanh thu ${year ? `năm ${year}` : "tổng"} thành công`,
      totalRevenue: total[0]?.totalRevenue || 0
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Thống kê doanh thu thất bại",
      error: err.message
    });
  }
};


// Doanh thu theo tháng trong năm hiện tại
export const getMonthlyRevenue = async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // Ngày 1 tháng 1 năm nay

    const rawData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
          $or: [
            { paymentMethod: "online", isPaid: true },
            { paymentMethod: "cod", status: "delivered" }
          ]
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Nhóm theo tháng (1-12)
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
      "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
      "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const dataMap = rawData.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});

    const fullData = months.map((month, index) => {
      const data = dataMap[index + 1]; // MongoDB tháng bắt đầu từ 1
      return {
        month,
        totalRevenue: data?.totalRevenue || 0,
        orderCount: data?.orderCount || 0
      };
    });

    res.json({
      success: true,
      message: "Thống kê doanh thu theo tháng thành công",
      data: fullData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê theo tháng",
      error: err.message
    });
  }
};

// Thống kê số lượng đơn hàng theo trạng thái
export const getOrderStats = async (req, res) => {
  try {
    const [tong, daHuy, choXuLy, choLayHang, dangGiao, daGiao] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "cancelled" }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "shipping" }),
      Order.countDocuments({ status: "delivered" }),
    ]);

    res.json({
      success: true,
      message: "Thống kê đơn hàng theo trạng thái thành công",
      data: {
        "Tổng đơn hàng": tong,
        "Đơn đã huỷ": daHuy,
        "Chờ xử lý": choXuLy,
        "Chờ lấy hàng": choLayHang,
        "Đang giao hàng": dangGiao,
        "Đã giao hàng": daGiao,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không thể thống kê đơn hàng",
      error: err.message,
    });
  }
};

// Top 5 sách bán chạy
export const getTopBooks = async (req, res) => {
  try {
    const topBooks = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.book",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$book" },
      {
        $project: {
          title: "$book.title",
          totalSold: 1
        }
      }
    ]);

    res.json({
      success: true,
      message: "Thống kê sách bán chạy thành công",
      data: topBooks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi thống kê sách bán chạy",
      error: err.message
    });
  }
};
