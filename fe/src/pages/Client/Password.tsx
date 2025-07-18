import React, { useState } from "react";
import { changePassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      await changePassword({ currentPassword, newPassword });
      setMessage("✅ Đổi mật khẩu thành công");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-2 border rounded pr-10";
  const iconStyle = "absolute right-2 top-2 cursor-pointer text-gray-500";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Đổi mật khẩu</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mật khẩu hiện tại */}
        <div className="relative">
          <label className="block font-medium mb-1">Mật khẩu hiện tại</label>
          <input
            type={showCurrent ? "text" : "password"}
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputStyle}
            required
          />
          <span
            className={iconStyle}
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Mật khẩu mới */}
        <div className="relative">
          <label className="block font-medium mb-1">Mật khẩu mới</label>
          <input
            type={showNew ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputStyle}
            required
          />
          <span
            className={iconStyle}
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="relative">
          <label className="block font-medium mb-1">Xác nhận mật khẩu</label>
          <input
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputStyle}
            required
          />
          <span
            className={iconStyle}
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
