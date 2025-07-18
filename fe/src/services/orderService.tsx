import axios from "../utils/axios";
import { IOrder } from "../interface/order";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("token") || "";

// Hàm tạo header có token
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ✅ Tạo đơn hàng mới
export const createOrder = async (order: Partial<IOrder>) => {
  const res = await axios.post("/api/order", order, getAuthHeader());
  return res.data.data; 
};

// ✅ Lấy đơn hàng của người dùng hiện tại (phải có token)
export const getMyOrders = async (): Promise<IOrder[]> => {
  try {
    const res = await axios.get("/api/order/me", getAuthHeader());
    return res.data.data as IOrder[];
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng của tôi:", error);
    return [];
  }
};


// ✅ Lấy tất cả đơn hàng (admin/staff)
export const getAllOrders = async (params?: any) => {
  const res = await axios.get("/api/order/admin", {
    ...getAuthHeader(),
    params,
  });
  return res.data;
};

// ✅ Lấy chi tiết đơn hàng theo ID 
export const getOrderById = async (id: string) => {
  const res = await axios.get(`/api/order/${id}`, getAuthHeader());
  return res.data.data as IOrder;
};

// ✅ Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id: string, status: string) => {
  const res = await axios.patch(
    `/api/order/update-status/${id}`,
    { status },
    getAuthHeader()
  );
  return res.data.order as IOrder;
};
export const repeatOrder = async (orderId: string) => {
  const res = await axios.post(`/api/order/${orderId}/repeat`, {}, getAuthHeader());
  return res.data;
};
export const createVnpayPayment = async (amount: number) => {
  const res = await axios.post("/api/order/vnpay/create-payment", { amount }, getAuthHeader());
  return res.data.url;
};