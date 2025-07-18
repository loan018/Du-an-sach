import axios from "axios";
import { IContact } from "../interface/lienhe"; 

const API_URL = "http://localhost:3000/api/contact";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("token") || "";

// Lấy tất cả liên hệ (cần token)
export const getAllContacts = async (): Promise<IContact[]> => {
  const token = getToken();
  const res = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

// Tạo liên hệ mới (cần token)
export const createContact = async (contact: IContact): Promise<IContact> => {
  const token = getToken();
  const res = await axios.post(`${API_URL}`, contact, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Lấy chi tiết 1 liên hệ theo ID (cần token)
export const getContactById = async (id: string): Promise<IContact> => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.contact;
};

// Cập nhật liên hệ (cần token)
export const updateContact = async (id: string, contact: IContact): Promise<IContact> => {
  const token = getToken();
  const res = await axios.put(`${API_URL}/${id}`, contact, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.contact;
};

// Xoá liên hệ (cần token)
export const deleteContact = async (id: string): Promise<void> => {
  const token = getToken();
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
