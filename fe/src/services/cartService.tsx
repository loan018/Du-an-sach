import axios from "../utils/axios";
import { IBook } from "../interface/book";

interface CartItem {
  _id: string;
  book: IBook;
  quantity: number;
  selected: boolean; 
}


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getCart = async (): Promise<CartItem[]> => {
  const res = await axios.get("/api/cart", getAuthHeader());
  return res.data.data.items;
};

export const addToCart = async (
  bookId: string,
  quantity: number = 1
): Promise<CartItem[]> => {
  const res = await axios.post(
    "/api/cart",
    { bookId, quantity },        
    getAuthHeader()
  );
  return res.data.data.items;
};



export const updateCartItem = async (
  bookId: string,
  quantity: number
): Promise<CartItem[]> => {
  const res = await axios.put(
    "/api/cart",
    { bookId, quantity },
    getAuthHeader()
  );
  return res.data.data.items;
};

export const removeCartItem = async (
  cartItemId: string
): Promise<CartItem[]> => {
  const res = await axios.delete(`/api/cart/${cartItemId}`, getAuthHeader());
  return res.data.data.items;
};

export const clearCart = async (): Promise<CartItem[]> => {
  const res = await axios.delete("/api/cart/clear/all", getAuthHeader());
  return res.data.data?.items || [];
};
