import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContactById, updateContact } from "../../services/lienService";
import { toast } from "react-toastify";
import { IContact } from "../../interface/lienhe";

const LienHeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IContact>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const contact = await getContactById(id);
        setFormData({
          name: contact.name || "",
          email: contact.email || "",
          subject: contact.subject || "",
          message: contact.message || "",
        });
      } catch (error) {
        toast.error("Không tìm thấy liên hệ.");
        // navigate("/contact");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validate = () => {
    const newErrors = {
      subject: formData.subject ? "" : "Chủ đề không được để trống",
      message: formData.message ? "" : "Nội dung không được để trống",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    try {
      await updateContact(id, formData);
      toast.success("Cập nhật liên hệ thành công!");
      navigate("/contact");
    } catch (error) {
      toast.error("Cập nhật thất bại.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Chỉnh sửa liên hệ
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Họ tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Chủ đề</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Nội dung</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Cập nhật liên hệ
        </button>
      </form>
    </div>
  );
};

export default LienHeEdit;
