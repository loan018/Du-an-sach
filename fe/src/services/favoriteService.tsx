import axios from "axios";

const API_URL = "http://localhost:3000/api/favorite";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("token") || "";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getFavoriteBooks = async (): Promise<{ _id: string }[]> => {
  const res = await axios.get(`${API_URL}`, getAuthHeader());
  return res.data.data;
};

export const addToFavorite = async (bookId: string): Promise<void> => {
  await axios.post(`${API_URL}/${bookId}`, {}, getAuthHeader());
};

export const removeFromFavorite = async (bookId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${bookId}`, getAuthHeader());
};
