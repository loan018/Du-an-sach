import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { ILoginInput } from "../interface/auth";

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);
      const role = parsedUser.role;

      if (role === "admin" || role === "staff") {
        navigate("/admin");
      } else if (role === "user") {
        navigate("/");
      } else {
        // Role không hợp lệ
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const onSubmit = async (data: ILoginInput) => {
    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      alert("Đăng nhập thành công");

      const role = res.user.role;
      if (role === "admin" || role === "staff") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/book-bg.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#5D4037] mb-6">
          Đăng nhập tài khoản
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <input
              {...register("email", { required: "Email không được để trống" })}
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password", {
                required: "Mật khẩu không được để trống",
                minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" },
              })}
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#8D6E63] text-white font-semibold rounded hover:bg-[#5D4037] transition"
          >
            Đăng nhập
          </button>

          {/* Đăng ký */}
          <div className="text-center text-sm mt-4">
            <span className="text-gray-700">Chưa có tài khoản? </span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#5D4037] font-medium hover:underline"
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
