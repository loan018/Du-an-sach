import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Book from "../models/books.js";
import Notification from "../models/bell.js";
import User from "../models/user.js";
import crypto from "crypto";
import moment from "moment";
import qs from "qs";

const generateOrderCode = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD${datePart}-${randomPart}`;
};

// ✅ 1. Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Giỏ hàng trống" });
    }

    // 👇 Lọc item được chọn từ FE (nếu có)
    const selectedItems =
      req.body.items && req.body.items.length > 0
        ? req.body.items.map((item) => ({
            book: item.bookId || item.book,
            quantity: item.quantity,
            price: item.price || 0,
          }))
        : cart.items.map((item) => ({
            book: item.book._id,
            quantity: item.quantity,
            price: item.book.price,
          }));

    const orderItems = [];
    let totalAmount = 0;

    // ✅ Kiểm tra kho + tính tổng tiền
    for (const selectedItem of selectedItems) {
      const book = await Book.findById(selectedItem.book);
      if (!book || book.quantity < selectedItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sách "${book?.title || "Không rõ"}" không đủ số lượng`,
        });
      }

      book.quantity -= selectedItem.quantity;
      await book.save();

      // Cảnh báo khi gần hết hàng
      if (book.quantity < 3) {
        await Notification.create({
          message: `⚠️ Sách "${book.title}" sắp hết hàng (còn ${book.quantity})!`,
          type: "stock",
          link: `/admin/book`,
        });
      }

      orderItems.push({
        book: selectedItem.book,
        quantity: selectedItem.quantity,
        price: selectedItem.price,
      });

      totalAmount += selectedItem.quantity * selectedItem.price;
    }

    // ✅ Tạo đơn
    const newOrder = await Order.create({
      user: userId,
      orderCode: generateOrderCode(),
      shippingInfo: req.body.shippingInfo,
      items: orderItems,
      totalAmount,
      paymentMethod: req.body.paymentMethod || "cod",
     isPaid: req.body.paymentMethod === "vnpay",
paidAt: req.body.paymentMethod === "vnpay" ? new Date() : null,

    });

    // ✅ Thông báo cho admin + người dùng
    const user = await User.findById(userId);

    await Notification.create({
      message: `🛒 Đơn hàng mới từ ${user?.name || "người dùng"}!`,
      type: "order",
      userId,
      link: `/admin/order/${newOrder._id}`,
    });

    await Notification.create({
      message: `🎉 Bạn đã đặt hàng thành công với mã đơn ${newOrder.orderCode}`,
      type: "order",
      userId,
      link: `/order/${newOrder._id}`,
    });

   if (req.body.paymentMethod === "vnpay") {
  await Notification.create({
    message: `💳 Thanh toán VNPAY thành công cho đơn ${newOrder.orderCode}`,
    type: "payment",
    userId,
    link: `/order/${newOrder._id}`,
  });
}

    // ✅ Xoá item đã đặt khỏi giỏ
    cart.items = cart.items.filter(
      (cartItem) =>
        !orderItems.some(
          (ordered) => ordered.book.toString() === cartItem.book._id.toString()
        )
    );
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi đặt hàng",
      error: err.message,
    });
  }
};





//Xem đơn hàng của chính mình
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.book")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Lấy được đơn hàng thành công",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không lấy được đơn hàng",
      error: err.message,
    });
  }
};


//Xem toàn bộ đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const { search = "", status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Tìm kiếm theo tên người nhận
    if (search.trim()) {
      query["shippingInfo.name"] = { $regex: search.trim(), $options: "i" };
    }

    // Lọc theo trạng thái đơn hàng
    if (status && status !== "all") {
      query.status = status;
    }

    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 10;
    const skip = (currentPage - 1) * perPage;

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      message: "Lấy danh sách đơn thành công",
      data: orders,
      pagination: {
        totalItems: totalOrders,
        totalPages: Math.ceil(totalOrders / perPage),
        currentPage,
        perPage,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không lấy được danh sách đơn",
      error: err.message,
    });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.book", "title price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    res.json({
      success: true,
      message: "Lấy chi tiết đơn hàng thành công",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết đơn hàng",
      error: err.message,
    });
  }
};

//Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "processing", "shipping", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const wasDelivered = order.status === "delivered";
    order.status = status;

    if (status === "delivered" && !wasDelivered) {
      order.deliveredAt = new Date();

      // Nếu là COD thì cập nhật đã thanh toán
      if (order.paymentMethod === "cod") {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    await order.save();

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật trạng thái đơn hàng",
      error: err.message,
    });
  }
};

export const repeatOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: userId }).populate("items.book");
    if (!order || order.status !== "cancelled") {
      return res.status(400).json({ success: false, message: "Chỉ có thể mua lại đơn đã hủy" });
    }

    // Xóa giỏ hàng hiện tại (hoặc có thể giữ lại nếu bạn muốn)
    await Cart.deleteOne({ user: userId });

    // Thêm lại các sản phẩm từ đơn hàng cũ
    const cartItems = order.items.map((item) => ({
      user: userId,
      book: item.book._id,
      quantity: item.quantity,
      price: item.price,
    }));

    await Cart.insertMany(cartItems);

    res.json({
      success: true,
      message: "Đã thêm lại sản phẩm vào giỏ hàng",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi mua lại đơn hàng",
      error: err.message,
    });
  }
};

export const createVnpayPayment = (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const tmnCode = "69YR3TLU";
  const secretKey = "PZQASFQ490VCU2FI16TUEQC4QXWGQKPQ";
  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = "http://localhost:5173/payment-vnpay-return";

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const orderId = moment(date).format("HHmmss");
  const amount = req.body.amount * 100;

  const orderInfo = "Thanh toan don hang";
  const bankCode = "NCB";
  const locale = "vn";
  const currCode = "VND";

  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_BankCode: bankCode,
  };

  const sortedParams = sortObject(vnpParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  sortedParams.vnp_SecureHash = signed;
  const paymentUrl = vnpUrl + "?" + qs.stringify(sortedParams, { encode: false });

  res.json({ url: paymentUrl });
};

// Hàm sắp xếp object theo key để ký dữ liệu
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}