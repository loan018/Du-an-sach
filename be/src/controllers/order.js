import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Book from "../models/books.js";
// Đặt hàng từ giỏ hàng
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Giỏ hàng trống" });
    }

    const orderItems = cart.items.map((item) => ({
      book: item.book.id,
      quantity: item.quantity,
      price: item.book.price,
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = await Order.create({
      user: userId,
      shippingInfo: req.body.shippingInfo, // Thông tin giao hàng
      items: orderItems,
      totalAmount,
      paymentMethod: req.body.paymentMethod || "cod",
      isPaid: req.body.paymentMethod === "momo",
      paidAt: req.body.paymentMethod === "momo" ? new Date() : null,
    });

    // Xoá giỏ hàng sau khi đặt
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ success: true, message: "Đặt hàng thành công", data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi đặt hàng", error: err.message });
  }
};

//Xem đơn hàng của chính mình
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, message: "Lấy được đơn hàng thành công", data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Không lấy được đơn hàng", error: err.message });
  }
};

//Xem toàn bộ đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true,message: "Lấy được danh sách đơn thành công", data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Không lấy được danh sách đơn", error: err.message });
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
      if (order.paymentMethod === "cod") {
        order.isPaid = true;
        order.paidAt = new Date();
      }
      for (const item of order.items) {
        await Book.findByIdAndUpdate(item.book, {
          $inc: {quantity : -item.quantity }
        });
      }
    }

    await order.save();

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật trạng thái",
      error: err.message
    });
  }
};
