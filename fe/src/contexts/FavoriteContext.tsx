import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFavoriteBooks,
  addToFavorite,
  removeFromFavorite, // ✅ đúng tên export
} from "../services/favoriteService";

interface FavoriteContextType {
  favorites: string[];
  fetchFavorites: () => void;
  addToFavorites: (bookId: string) => void;
  removeFromFavorites: (bookId: string) => void;
}

const FavoriteContext = createContext<FavoriteContextType>(
  {} as FavoriteContextType
);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchFavorites = async () => {
    try {
      const books = await getFavoriteBooks();
      setFavorites(books.map((b) => b._id));
    } catch (err) {
      console.error("Lỗi khi fetch favorites:", err);
    }
  };

  const addToFavorites = async (bookId: string) => {
    try {
      await addToFavorite(bookId);
      setFavorites((prev) => [...prev, bookId]);
    } catch (err) {
      console.error("Lỗi khi thêm yêu thích:", err);
    }
  };

  const removeFromFavorites = async (bookId: string) => {
    try {
      await removeFromFavorite(bookId);
      setFavorites((prev) => prev.filter((id) => id !== bookId));
    } catch (err) {
      console.error("Lỗi khi xoá yêu thích:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);
