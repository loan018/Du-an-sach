import React, { useEffect, useState } from "react";
import { getAllBanners, deleteBanner } from "../../../services/bannerService";
import { IBanner } from "../../../interface/banner";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";

const BANNERS_PER_PAGE = 10;

const BannerList: React.FC = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">("newest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách banner:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá banner này không?");
    if (!confirm) return;
    try {
      await deleteBanner(id);
      alert("✅ Xóa banner thành công!");
      fetchBanners();
    } catch (error) {
      console.error("Lỗi khi xoá banner:", error);
    }
  };

  const startIndex = (currentPage - 1) * BANNERS_PER_PAGE;
  const endIndex = startIndex + BANNERS_PER_PAGE;

  const sortedBanners = [...banners].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sortOrder === "az") {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === "za") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedBanners.length / BANNERS_PER_PAGE);
  const currentBanners = sortedBanners.slice(startIndex, endIndex);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-rose-700 flex items-center justify-center gap-2">
        Quản lý Banner
      </h1>

      <div className="flex justify-between items-center mb-6">
        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "newest" | "oldest" | "az" | "za")
          }
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
         <option value="newest">Từ ngày mới → ngày cũ</option>
          <option value="oldest">Từ ngày cũ → ngày mới</option>
          <option value="az">Từ A đến Z</option>
          <option value="za">Từ Z đến A</option>
        </select>

        <button
          onClick={() => navigate("/admin/banner/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          ➕ Thêm Banner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-gray-400 shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-rose-200 text-rose-900 font-semibold text-center">
              <th className="p-3 border border-gray-400">STT</th>
              <th className="p-3 border border-gray-400">Tiêu đề</th>
              <th className="p-3 border border-gray-400">Hình ảnh</th>
              <th className="p-3 border border-gray-400">Link</th>
              <th className="p-3 border border-gray-400">Ngày bắt đầu</th>
              <th className="p-3 border border-gray-400">Trạng thái</th>
              <th className="p-3 border border-gray-400">Hành động</th>
            </tr>
          </thead>
          <tbody className="border-t border-b border-gray-400 text-center">
            {currentBanners.map((banner, index) => (
              <tr key={banner._id} className="hover:bg-rose-50 transition">
                <td className="p-3 border border-gray-300">
                  {startIndex + index + 1}
                </td>
                <td className="p-3 border border-gray-300">{banner.title}</td>
                <td className="p-3 border border-gray-300">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-12 mx-auto rounded"
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  {banner.link ? (
                    <a
                      href={banner.link}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Xem
                    </a>
                  ) : (
                    "Không có"
                  )}
                </td>
                <td className="p-3 border border-gray-300">
                  {new Date(banner.startDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      banner.isActive
                        ? "text-green-600 font-medium"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {banner.isActive ? "Hiển thị" : "Ẩn"}
                  </span>
                </td>
                <td className="p-3 border border-gray-300">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/banner/edit/${banner._id}`)
                      }
                      className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                    >
                      <Pencil size={16} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id!)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentBanners.length === 0 && (
              <tr>
                <td colSpan={7} className="text-gray-500 italic p-6">
                  Không có banner nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="text-2xl text-rose-600 hover:text-rose-800 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ◀
        </button>
        <span className="font-semibold text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="text-2xl text-rose-600 hover:text-rose-800 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ▶️
        </button>
      </div>
    </div>
  );
};

export default BannerList;
