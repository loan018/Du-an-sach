import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { IRegisterInput } from "../interface/auth";

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IRegisterInput>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "user") {
        navigate("/");
      }
    }
  }, [navigate]);

  const onSubmit = async (data: IRegisterInput) => {
    try {
      const res = await registerUser(data);

      // Lưu vào localStorage nếu muốn auto login
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Đăng ký thành công");
      navigate("/");
    } catch (err) {
      alert("Email đã tồn tại hoặc lỗi hệ thống");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/book-bg.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#5D4037] mb-6">Tạo tài khoản</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Họ tên */}
          <div>
            <input
              {...register("name", { required: "Họ tên không được để trống" })}
              placeholder="Họ tên"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email không được để trống",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Email không hợp lệ"
                }
              })}
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Mật khẩu */}
          <div>
            <input
              {...register("password", {
                required: "Mật khẩu không được để trống",
                minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" }
              })}
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Số điện thoại */}
          <div>
            <input
              {...register("phone", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số"
                }
              })}
              placeholder="Số điện thoại (tuỳ chọn)"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            className="w-full py-3 bg-[#8D6E63] text-white font-semibold rounded hover:bg-[#5D4037] transition"
          >
            Đăng ký
          </button>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-700">Đã có tài khoản? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#5D4037] font-medium hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
