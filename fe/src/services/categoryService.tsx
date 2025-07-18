import axios from "../utils/axios";
import { ICategory } from "../interface/category";

export const getAllCategories =async (params?: any) => {
  const res = await axios.get("/api/category", { params });
  return res.data;
};

export const getCategoryById = async (id: string) => {
  const res = await axios.get(`/api/category/${id}`);
  return res.data;
};

export const createCategory = async (category: ICategory) => {
  const res = await axios.post("/api/category", category);
  return res.data.category;
};

export const updateCategory = async (id: string, category: ICategory) => {
  const res = await axios.put(`/api/category/${id}`, category);
  return res.data.category;
};

export const deleteCategory = async (id: string) => {
  await axios.delete(`/api/category/${id}`);
};

export const hideCategory = async (id: string) => {
  await axios.patch(`/api/category/hide/${id}`);
};
