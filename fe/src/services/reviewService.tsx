import axios from "../utils/axios";
import { IReview } from "../interface/review";

// Tạo đánh giá mới
export const createReview = async (review: Partial<IReview>) => {
  const res = await axios.post("/api/review", review);
  return res.data.review;
};

// Lấy danh sách đánh giá theo ID sách
export const getReviewsByBook = async (bookId: string) => {
  const res = await axios.get(`/api/review/book/${bookId}`);
  return res.data.reviews;
};

// Ẩn đánh giá (dùng cho staff/admin)
export const hideReview = async (id: string) => {
  const res = await axios.patch(`/api/review/hide/${id}`);
  return res.data.review;
};

// Lấy tất cả đánh giá (dùng cho staff/admin)
export const getReviewsBook = async (params?: any) => {
  const res = await axios.get("/api/review", { params });
  return res.data;
};

