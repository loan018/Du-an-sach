import React, { useEffect, useState } from "react";
import { getMe, updateMe, uploadAvatar } from "../../services/authService";
import { IUser } from "../../interface/auth";
import { useAuth } from "../../hooks/Admin/useAuth";

const ProfileInfo: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [gender, setGender] = useState<"Nam" | "Nữ" | "Khác">("Khác");
  const [birthday, setBirthday] = useState({ day: "", month: "", year: "" });
  

  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMe();
        setUser(data);
        setName(data.name);
        setPhone(data.phone || "");
        setGender(data.gender || "Khác");

        const avatarUrl = data.avatar?.startsWith("http")
          ? data.avatar
          : data.avatar
          ? `http://localhost:3000/${data.avatar}`
          : "/default-avatar.png";
        setAvatarPreview(avatarUrl);

        if (data.birthday) {
          const [year, month, day] = data.birthday.split("-");
          setBirthday({ day, month, year });
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin:", err);
      }
    };
    fetchData();
  }, []);

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadAvatar(file);
        setAvatarPreview(uploadedUrl);
        setUser((prev) => (prev ? { ...prev, avatar: uploadedUrl } : null));
      } catch (err) {
        console.error("Lỗi khi upload avatar:", err);
        alert("Upload ảnh thất bại");
      }
    }
  };

  const handleSave = async () => {
    try {
      const birthdayStr =
        birthday.day && birthday.month && birthday.year
          ? `${birthday.year}-${birthday.month.padStart(
              2,
              "0"
            )}-${birthday.day.padStart(2, "0")}`
          : "";

      const updatedUser = await updateMe({
        name,
        phone,
        gender,
        birthday: birthdayStr,
        avatar: user?.avatar,
      });

      setUser(updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const genders: ("Nam" | "Nữ" | "Khác")[] = ["Nam", "Nữ", "Khác"];
  


  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-1">Hồ Sơ Của Tôi</h1>
      <p className="text-gray-400 text-sm mb-8">
        Quản lý thông tin để bảo mật tài khoản
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm mb-1">Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 rounded border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <p>{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 rounded border border-gray-700"
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="text-sm">Giới tính:</label>
            {genders.map((g) => (
              <label key={g} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  checked={gender === g}
                  onChange={() => setGender(g)}
                />
                {g}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select
              className="bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm"
              value={birthday.day}
              onChange={(e) =>
                setBirthday({ ...birthday, day: e.target.value })
              }
            >
              <option>Ngày</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>
            <select
              className="bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm"
              value={birthday.month}
              onChange={(e) =>
                setBirthday({ ...birthday, month: e.target.value })
              }
            >
              <option>Tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>
            <select
              className="bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm"
              value={birthday.year}
              onChange={(e) =>
                setBirthday({ ...birthday, year: e.target.value })
              }
            >
              <option>Năm</option>
              {Array.from({ length: 80 }, (_, i) => (
                <option key={i}>{2025 - i}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSave}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Lưu
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={avatarPreview}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <label className="cursor-pointer bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600">
            Chọn Ảnh
            <input type="file" hidden onChange={handleAvatarChange} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
