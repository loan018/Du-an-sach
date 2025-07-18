// src/pages/Client/OrderSuccess.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Đặt hàng thành công!</h1>
      <p className="text-gray-600 mb-6">
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Về trang chủ
        </button>
        <button
          onClick={() => navigate("/profile/orders")}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Xem đơn mua
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
