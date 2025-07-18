import axios from "axios";
import { IBanner } from "../interface/banner";

const API_URL = "http://localhost:3000/api/banner";

// Lấy token từ localStorageconst getToken = () => {
const getToken = () => localStorage.getItem("token") || "";

// Gọi không cần token
export const getAllBanners = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data.banners;
};

// Tạo banner mới (cần token)
export const createBanner = async (banner: IBanner) => {
  const token = getToken();
    console.log("🚀 Token gửi lên:", token);
  const res = await axios.post(`${API_URL}`, banner, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.banner;
};

// Lấy chi tiết banner (không cần token)
export const getBannerById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data.banner;
};

// Cập nhật banner (cần token)
export const updateBanner = async (id: string, banner: IBanner) => {
  const token = getToken();
  const res = await axios.put(`${API_URL}/${id}`, banner, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.banner;
};

// Xoá banner (cần token)
export const deleteBanner = async (id: string) => {
  const token = getToken();
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
