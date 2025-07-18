import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import slugify from "slugify";
import { getCategoryById, updateCategory } from "../../../services/categoryService";
import { ICategory } from "../../../interface/category";

const CategoryEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ICategory>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sortOrder: 0,
      isActive: true,
      image: "", // ✅ default image
    },
  });

  const nameValue = watch("name");

  // Tự sinh slug khi tên thay đổi
  useEffect(() => {
    const newSlug = slugify(nameValue || "", { lower: true, strict: true });
    setValue("slug", newSlug);
  }, [nameValue, setValue]);

  // Lấy dữ liệu theo ID
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategoryById(id!);
        reset(res.data); // ✅ Load dữ liệu cũ
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
        alert("Không tìm thấy danh mục.");
        navigate("/admin/category");
      }
    };

    if (id) fetchCategory();
  }, [id, reset, navigate]);

  const onSubmit = async (data: ICategory) => {
    try {
      await updateCategory(id!, data);
      alert("✅ Cập nhật danh mục thành công!");
      navigate("/admin/category");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật danh mục:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-violet-600 mb-6 text-center">Cập Nhật Danh Mục</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Tên danh mục */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tên danh mục</label>
          <input
            type="text"
            {...register("name", {
              required: "Tên không được để trống",
              minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
              maxLength: { value: 100, message: "Tối đa 100 ký tự" },
            })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-violet-400"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            {...register("slug")}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            {...register("description", { maxLength: 500 })}
            rows={3}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-violet-400"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">Tối đa 500 ký tự</p>}
        </div>

        {/* Hình ảnh */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Hình ảnh (URL)</label>
          <input
            type="text"
            {...register("image", {
              maxLength: { value: 500, message: "Tối đa 500 ký tự" },
            })}
            placeholder="https://example.com/image.jpg"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-violet-400"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        </div>

        {/* Thứ tự */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Thứ tự</label>
          <input
            type="number"
            {...register("sortOrder", {
              min: { value: 0, message: "Không được nhỏ hơn 0" },
            })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-violet-400"
          />
          {errors.sortOrder && <p className="text-red-500 text-sm mt-1">{errors.sortOrder.message}</p>}
        </div>

        {/* Trạng thái */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={watch("isActive")}
            onChange={(e) => setValue("isActive", e.target.checked)}
          />
          <label className="text-gray-700 font-medium">Hiển thị danh mục</label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-lg"
          >
            Cập Nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;
