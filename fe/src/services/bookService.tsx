import axios from "../utils/axios";
import { IBook } from "../interface/book";

// Lấy danh sách tất cả sách (có phân trang, tìm kiếm, lọc)
export const getAllBooks = async (params?: any) => {
  const res = await axios.get("/api/book", { params });
  return res.data;
};

// Lấy thông tin sách theo ID
export const getBookById = async (id: string) => {
  const res = await axios.get(`/api/book/${id}`);
  return res.data;
};

// Tạo sách mới
export const createBook = async (book: IBook) => {
  const res = await axios.post("/api/book", book);
  return res.data.book;
};

// Cập nhật thông tin sách
export const updateBook = async (id: string, book: IBook) => {
  const res = await axios.put(`/api/book/${id}`, book);
  return res.data.book;
};

// Xóa sách
export const deleteBook = async (id: string) => {
  await axios.delete(`/api/book/${id}`);
};

// Ẩn sách (ẩn mềm)
export const hideBook = async (id: string) => {
  await axios.patch(`/api/book/hide/${id}`);
};

export const getRelatedBooks = async (id: string) => {
  const res = await axios.get(`/api/book/related/${id}`);
  return res.data.data; 
};

// Tìm kiếm sách theo từ khóa
export const searchBooks = async (keyword: string) => {
  const res = await getAllBooks({
    search: keyword,
    limit: 20,
    page: 1,
  });
  return res.data as IBook[];
};

