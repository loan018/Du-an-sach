import { ILoginInput, IRegisterInput, IUpdateProfileInput, IUser, IUserResponse } from "../interface/auth";
import axios from "../utils/axios";
const API = "/api/users";
// Đăng ký
export const registerUser = async (data: IRegisterInput): Promise<IUserResponse> => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
};

// Đăng nhập
export const loginUser = async (data: ILoginInput): Promise<IUserResponse> => {
  const res = await axios.post(`${API}/login` , data);
  return res.data;
};

// Lấy thông tin chính mình
export const getMe = async (): Promise<IUser> => {
  const res = await axios.get(`${API}/me`);
  return res.data.user;
};
export const getAllUsers = async (params = {}) => {
  const res = await axios.get("/api/users", { params });
  return res.data; 
};
// Cập nhật vai trò
export const updateUserRole = async (
  id: string,
  role: IUser["role"]
): Promise<{ success: boolean; user: IUser }> => {
  const res = await axios.put(`${API}/${id}/role`, { role });
  return res.data;
};

// Ẩn người dùng
export const hideUser = async (
  id: string
): Promise<{ success: boolean; user: IUser }> => {
  const res = await axios.patch(`${API}/${id}`);
  return res.data;
};

// Cập nhật thông tin người dùng
export const updateMe = async (data: IUpdateProfileInput): Promise<IUser> => {
  const res = await axios.put(`${API}/me`, data);
  return res.data;
};

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.post("/api/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url; 
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  const res = await axios.put(`${API}/change-password`, data);
  return res.data;
};