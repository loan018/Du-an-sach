import React, { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/addService";
import { IAddress } from "../../interface/order";
import { useNavigate } from "react-router-dom";

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [newAddress, setNewAddress] = useState<
    Omit<IAddress, "_id" | "user" | "createdAt" | "updatedAt">
  >({
    fullName: "",
    phone: "",
    province: "",
    ward: "",
    street: "",
    isDefault: false,
    type: "home",
  });

  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await getAddresses();
      const sorted = [...res].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      setAddresses(sorted);
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    const { fullName, phone, province, ward, street } = newAddress;
    if (!fullName || !phone || !province || !ward || !street)
      return alert("Vui lòng điền đầy đủ thông tin.");

    try {
      const res = await addAddress(newAddress);
      const updatedList = [...addresses, res].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      setAddresses(updatedList);
      setNewAddress({
        fullName: "",
        phone: "",
        province: "",
        ward: "",
        street: "",
        isDefault: false,
        type: "home",
      });
      setShowForm(false);
    } catch {
      alert("Lỗi thêm địa chỉ");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((item) => item._id !== id));
    } catch {
      alert("Lỗi xoá địa chỉ");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await setDefaultAddress(id);
      const res = await getAddresses();
      const sorted = [...res].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      setAddresses(sorted);
    } catch {
      alert("Lỗi cập nhật mặc định");
    }
  };

  return (
    <div className="flex-1 px-6 py-8 text-white max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Địa chỉ</h2>

      <div className="space-y-5">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className={`rounded-lg p-4 border ${
              addr.isDefault ? "border-green-500 bg-green-900/20" : "border-gray-600 bg-zinc-800"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-lg">
                {addr.fullName} – {addr.phone}
              </div>
              {addr.isDefault && (
                <span className="text-sm text-green-400 font-semibold">
                  (Mặc định)
                </span>
              )}
            </div>
            <div className="text-sm text-gray-300 mb-3">
              {addr.street}, {addr.ward}, {addr.province}
            </div>
            <div className="flex gap-4 text-sm">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefaultAddress(addr._id!)}
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Đặt làm mặc định
                </button>
              )}
              <button
                onClick={() => navigate(`/profile/address/edit/${addr._id}`)}
                className="text-yellow-400 underline hover:text-yellow-300"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => handleDeleteAddress(addr._id!)}
                className="text-red-400 underline hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            + Thêm địa chỉ mới
          </button>
        )}

        {showForm && (
          <div className="mt-6 border-t border-gray-600 pt-6">
            <h3 className="text-xl font-semibold mb-4">
              Thêm địa chỉ mới
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Họ tên"
                className="bg-zinc-900 px-3 py-2 rounded border border-gray-600 w-full"
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, fullName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="bg-zinc-900 px-3 py-2 rounded border border-gray-600 w-full"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tỉnh / Thành phố"
                className="bg-zinc-900 px-3 py-2 rounded border border-gray-600 w-full"
                value={newAddress.province}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, province: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phường / Xã"
                className="bg-zinc-900 px-3 py-2 rounded border border-gray-600 w-full"
                value={newAddress.ward}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, ward: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Số nhà, tên đường..."
                className="bg-zinc-900 px-3 py-2 rounded border border-gray-600 w-full col-span-2"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
            </div>

            <iframe
              title="map"
              className="w-full h-48 rounded border border-gray-600 mb-4"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${newAddress.street}, ${newAddress.ward}, ${newAddress.province}`
              )}&output=embed`}
              allowFullScreen
              loading="lazy"
            />

            <div className="mb-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={newAddress.isDefault}
                  onChange={() =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: !newAddress.isDefault,
                    })
                  }
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowForm(false)}
                className="text-white underline hover:text-gray-300"
              >
                Huỷ
              </button>
              <button
                onClick={handleAddAddress}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Lưu địa chỉ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;
