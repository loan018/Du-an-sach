import { IAddress } from "../interface/order";
import axios from "../utils/axios";

const API = "/api/address";

// Lấy danh sách địa chỉ của người dùng
export const getAddresses = async (): Promise<IAddress[]> => {
  const res = await axios.get(API);
  return res.data;
};

// Thêm địa chỉ mới
export const addAddress = async (
  data: Omit<IAddress, "_id" | "user" | "createdAt" | "updatedAt">
): Promise<IAddress> => {
  const res = await axios.post(API, data);
  return res.data;
};

// Xoá địa chỉ
export const deleteAddress = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

// Thiết lập địa chỉ mặc định
export const setDefaultAddress = async (id: string): Promise<IAddress> => {
  const res = await axios.patch(`${API}/default/${id}`);
  return res.data;
};

// Cập nhật địa chỉ
export const updateAddress = async (
  id: string,
  data: Partial<IAddress>
): Promise<IAddress> => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};
