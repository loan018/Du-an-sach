import Order from "../models/order.js";
import Book from "../models/books.js";

// Tổng doanh thu 
export const getTotalRevenue = async (req, res) => {
  try {
    const total = await Order.aggregate([
      {
        $match: {
          $or: [
            { paymentMethod: "online", isPaid: true },
            { paymentMethod: "cod", status: "delivered" }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      success: true,
      message: "Thống kê doanh thu thành công",
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

//  Doanh thu theo tuần
export const getWeeklyRevenue = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          $or: [
            { status: "delivered" },
            { isPaid: true }
          ]
        }
      },
      {
        $group: {
          _id: { $isoDayOfWeek: "$createdAt" }, 
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo thứ trong tuần
      {
        $project: {
          _id: 0,
          day: {
            $arrayElemAt: [
              [
                "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm",
                "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
              ],
              { $subtract: [ "$_id", 1 ] }
            ]
          },
          totalRevenue: 1,
          orderCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      message: "Thống kê theo thứ trong tuần thành công",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê theo thứ",
      error: err.message
    });
  }
};

//Thống kê số lượng đơn hàng theo trạng thái
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
    res.json({ success: true,message: "Thống kê sách bán chạy thành công", data: topBooks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi thống kê sách bán chạy", error: err.message });
  }
};
