import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBannerById, updateBanner } from "../../../services/bannerService";
import { IBanner } from "../../../interface/banner";

const BannerEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IBanner>({
    title: "",
    image: "",
    link: "",
    startDate: new Date(),
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IBanner, string>>>({});

  // Lấy dữ liệu banner theo ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const banner = await getBannerById(id as string);
        setFormData(banner);
      } catch (error) {
        alert("Không thể lấy dữ liệu banner.");
      }
    };

    if (id) fetchData();
  }, [id]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (!formData.image.trim()) newErrors.image = "Link ảnh không được để trống";
    else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.image))
      newErrors.image = "Link ảnh không hợp lệ";

    if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateBanner(id as string, formData);
      alert("✅ Sửa banner thành công!");
      navigate("/admin/banner");
    } catch (error) {
      console.error("Lỗi khi sửa banner:", error);
      alert("❌ Sửa banner thất bại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Chỉnh sửa Banner
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Link hình ảnh</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Liên kết chuyển hướng (nếu có)
          </label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
          <input
            type="date"
            name="startDate"
            value={new Date(formData.startDate).toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4"
          />
          <label className="text-gray-700 font-medium">Hiển thị banner</label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerEdit;
