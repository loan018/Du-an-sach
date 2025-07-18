import React, { useState, useEffect } from "react";
import { createContact } from "../../services/lienService";
import { getMe } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LienHe: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setFormData((prev) => ({
          ...prev,
          name: user?.name || "",
          email: user?.email || "",
        }));
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
      }
    };
    fetchUser();
  }, []);

  // Validate dữ liệu
  const validate = () => {
    const newErrors = {
      name: formData.name ? "" : "Họ tên không được để trống",
      email: formData.email ? "" : "Email không được để trống",
      subject: formData.subject ? "" : "Chủ đề không được để trống",
      message: formData.message ? "" : "Nội dung không được để trống",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createContact(formData);
      toast.success("Gửi liên hệ thành công!");
      setTimeout(() => navigate("/contact"), 1500);
    } catch (error) {
      toast.error("Gửi liên hệ thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Liên hệ với chúng tôi
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Họ tên */}
        <div>
          <label className="block font-medium mb-1">Họ tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Chủ đề */}
        <div>
          <label className="block font-medium mb-1">Chủ đề</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Nhập chủ đề"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject}</p>
          )}
        </div>

        {/* Nội dung */}
        <div>
          <label className="block font-medium mb-1">Nội dung</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Nhập nội dung cần liên hệ"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
        </div>

        {/* Gửi liên hệ */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Gửi liên hệ
        </button>
      </form>
    </div>
  );
};

export default LienHe;
