import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAddresses, updateAddress } from "../../services/addService";
import { IAddress } from "../../interface/order";
import { toast } from "react-toastify";

const AddEditAddress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IAddress>({
    _id: "",
    user: "",
    fullName: "",
    phone: "",
    province: "",
    ward: "",
    street: "",
    address: "",
    isDefault: false,
    type: "home",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addresses = await getAddresses();
        const found = addresses.find((a) => a._id === id);
        if (found) {
          setFormData({
            ...found,
            address: `${found.street}, ${found.ward}, ${found.province}`,
            isDefault: found.isDefault ?? false,
            type: found.type ?? "home",
          });
        } else {
          toast.error("Không tìm thấy địa chỉ.");
        }
      } catch (error) {
        console.error("Lỗi khi tải địa chỉ:", error);
        toast.error("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAddress();
    else setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData._id && id) formData._id = id;
    if (!formData._id) {
      toast.error("Không tìm thấy ID địa chỉ để cập nhật.");
      return;
    }

    const parts = (formData.address || "").split(",").map((p) => p.trim());
    const [street, ward, province] = [
      parts[0] || formData.street,
      parts[1] || formData.ward,
      parts[2] || formData.province,
    ];

    const dataToUpdate: Partial<IAddress> = {
      fullName: formData.fullName,
      phone: formData.phone,
      street,
      ward,
      province,
      isDefault: formData.isDefault,
      type: formData.type,
    };

    try {
      await updateAddress(formData._id, dataToUpdate);
      toast.success("Cập nhật địa chỉ thành công!");
      navigate("/profile/address");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại.");
    }
  };

  // 👉 Đừng render nếu đang loading hoặc chưa có dữ liệu
  if (loading || (id && !formData._id)) {
    return <p className="text-white p-4">Đang tải dữ liệu...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-black text-white rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Cập nhật địa chỉ</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-gray-300">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-zinc-900 border border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-zinc-900 border border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-1 text-gray-300">Địa chỉ cụ thể</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded bg-zinc-900 border border-gray-600 text-white"
        />
        <p className="text-sm text-gray-500 mt-1">
          Ví dụ: 123 Nguyễn Trãi, Phường 5, TP Hồ Chí Minh
        </p>
      </div>

      <div className="mt-4">
        <iframe
          title="map"
          className="w-full h-48 rounded border border-gray-600"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            formData.address || ""
          )}&output=embed`}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="mt-4">
        <label className="block mb-2 text-gray-300">Loại địa chỉ:</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-white">
            <input
              type="radio"
              name="type"
              value="home"
              checked={formData.type === "home"}
              onChange={handleChange}
            />
            Nhà riêng
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="radio"
              name="type"
              value="office"
              checked={formData.type === "office"}
              onChange={handleChange}
            />
            Văn phòng
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label className="text-gray-300">Đặt làm địa chỉ mặc định</label>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2 border border-gray-600 rounded text-white hover:bg-gray-800"
        >
          Trở lại
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
        >
          Hoàn thành
        </button>
      </div>
    </form>
  );
};

export default AddEditAddress;
