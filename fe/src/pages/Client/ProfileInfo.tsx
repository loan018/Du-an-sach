import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getMe, updateMe, uploadAvatar } from "../../services/authService";
import { IUser } from "../../interface/auth";
import { useAuth } from "../../hooks/Admin/useAuth";

type FormValues = {
  name: string;
  phone: string;
  gender: "Nam" | "Nữ" | "Khác";
  day: string;
  month: string;
  year: string;
};

const ProfileInfo: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const { setCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMe();
        setUser(data);
        setValue("name", data.name);
        setValue("phone", data.phone || "");
        setValue("gender", data.gender || "Khác");

        const avatarUrl = data.avatar?.startsWith("http")
          ? data.avatar
          : data.avatar
          ? `http://localhost:3000/${data.avatar}`
          : "/default-avatar.png";
        setAvatarPreview(avatarUrl);

        if (data.birthday) {
          const [year, month, day] = data.birthday.split("-");
          setValue("day", day);
          setValue("month", month);
          setValue("year", year);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin:", err);
      }
    };
    fetchData();
  }, [setValue]);

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

  const onSubmit = async (data: FormValues) => {
    try {
      const { name, phone, gender, day, month, year } = data;
      const birthdayStr =
        day && month && year
          ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
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
  const day = watch("day");
  const month = watch("month");
  const year = watch("year");

  return (
    <form className="text-white" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-bold mb-1">Hồ Sơ Của Tôi</h1>
      <p className="text-gray-400 text-sm mb-8">
        Quản lý thông tin để bảo mật tài khoản
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm mb-1">Tên *</label>
            <input
              {...register("name", { required: "Tên không được bỏ trống" })}
              className="w-full bg-gray-800 px-4 py-2 rounded border border-gray-700"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <p>{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Số điện thoại *</label>
            <input
              {...register("phone", {
                required: "Số điện thoại không được bỏ trống",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              className="w-full bg-gray-800 px-4 py-2 rounded border border-gray-700"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="text-sm">Giới tính:</label>
            {genders.map((g) => (
              <label key={g} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  value={g}
                  {...register("gender")}
                />
                {g}
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              {...register("day", { required: "Chọn ngày sinh" })}
              className="bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm"
            >
              <option value="">Ngày</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>
            <select
              {...register("month", { required: "Chọn tháng sinh" })}
              className="bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm"
            >
              <option value="">Tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>
            <select
              {...register("year", { required: "Chọn năm sinh" })}
              className="bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm"
            >
              <option value="">Năm</option>
              {Array.from({ length: 80 }, (_, i) => (
                <option key={i}>{2025 - i}</option>
              ))}
            </select>
          </div>

          {(errors.day || errors.month || errors.year) && (
            <p className="text-red-500 text-sm">
              Vui lòng nhập đầy đủ ngày tháng năm sinh
            </p>
          )}

          <button
            type="submit"
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
    </form>
  );
};

export default ProfileInfo;
