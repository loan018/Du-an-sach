import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IBook } from "../../../interface/book";
import { ICategory } from "../../../interface/category";
import { createBook } from "../../../services/bookService";
import { getAllCategories } from "../../../services/categoryService";

const BookAdd: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<IBook>({
    defaultValues: {
      title: "",
      image: "",
      price: 0,
      oldPrice: 0,
      category: "",
      author: "",
      description: "",
      quantity: 0,
      isActive: true,
    },
  });

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories({ isActive: true });
        setCategories(res.data || []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Khi giá gốc thay đổi thì re-validate lại giá hiện tại
  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === "oldPrice") {
        trigger("price");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  const onSubmit = async (data: IBook) => {
    try {
      await createBook(data);
      alert("✅ Thêm sách thành công!");
      navigate("/admin/book");
    } catch (error) {
      console.error("❌ Lỗi khi thêm sách:", error);
      alert("Thêm sách thất bại!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-violet-600 mb-6 text-center">Thêm Sách Mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Tiêu đề */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tiêu đề</label>
          <input
            type="text"
            {...register("title", {
              required: "Tiêu đề là bắt buộc",
              minLength: { value: 2, message: "Tiêu đề sách quá ngắn" },
              maxLength: { value: 255, message: "Tiêu đề sách quá dài" },
            })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Ảnh */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Ảnh (URL)</label>
          <input
            type="text"
            {...register("image", {
              required: "Ảnh là bắt buộc",
              pattern: {
                value: /^https?:\/\/.+/,
                message: "Ảnh phải là một đường dẫn hợp lệ (URL)",
              },
            })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

         {/* Giá gốc */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Giá gốc</label>
          <input
            type="number"
            {...register("oldPrice", {
              min: { value: 1000, message: "Giá phải lớn hơn 1000" },
            })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.oldPrice && <p className="text-red-500 text-sm">{errors.oldPrice.message}</p>}
        </div>

        {/* Giá hiện tại */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Giá</label>
          <input
            type="number"
            {...register("price", {
              required: "Giá là bắt buộc",
              min: { value: 1000, message: "Giá phải lớn hơn 1000" },
              validate: (value) => {
                const oldPrice = Number(watch("oldPrice")) || 0;
                if (oldPrice > 0 && value > oldPrice) {
                  return "Giá phải nhỏ hơn hoặc bằng giá gốc";
                }
                return true;
              },
            })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>


        {/* Danh mục */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            {...register("category", { required: "Danh mục là bắt buộc" })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Tác giả */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tác giả</label>
          <input
            type="text"
            {...register("author", {
              required: "Tác giả là bắt buộc",
              minLength: { value: 2, message: "Tên tác giả quá ngắn" },
              maxLength: { value: 100, message: "Tên tác giả quá dài" },
            })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            {...register("description", {
              maxLength: { value: 1500, message: "Tối đa 1500 ký tự" },
            })}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Số lượng */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Số lượng</label>
          <input
            type="number"
            {...register("quantity", {
              required: "Số lượng là bắt buộc",
              min: { value: 0, message: "Số lượng không được âm" },
            })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>

        {/* Hiển thị */}
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} className="h-4 w-4" defaultChecked />
          <label className="text-gray-700 font-medium">Hiển thị sách</label>
        </div>

        {/* Nút Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-lg"
          >
            Thêm Sách
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAdd;
