import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/bell", 
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Lấy danh sách thông báo của người dùng hiện tại
export const getNotifications = () => {
  return api.get("/", getAuthHeader());
};

// Tạo thông báo (cần truyền userId nếu là admin tạo)
export const createNotification = (data: {
  message: string;
  type?: string;
  link?: string;
  userId: string;
}) => {
  return api.post("/", data, getAuthHeader());
};

// Đánh dấu một thông báo đã đọc
export const markAsRead = (id: string) => {
  return api.patch(`/${id}/read`, {}, getAuthHeader());
};

// Xoá thông báo
export const deleteNotification = (id: string) => {
  return api.delete(`/${id}`, getAuthHeader());
};

// Đánh dấu tất cả đã đọc
export const markAllAsRead = () => {
  return api.patch(`/read/all`, {}, getAuthHeader());
};

// Tìm kiếm (admin)
export const searchAdminData = (query: string) => {
  return api.get(`/search`, {
    params: { q: query },
    ...getAuthHeader(),
  });
};
