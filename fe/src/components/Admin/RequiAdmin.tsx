import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/Admin/useAuth";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [checking, setChecking] = useState(true); // Đợi load user
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (currentUser === null) return; // đợi load

    // Kiểm tra role sau khi currentUser đã có
    if (currentUser.role !== "admin" && currentUser.role !== "staff") {
      setRedirect(true);
    }
    setChecking(false);
  }, [currentUser]);

  if (checking) return null; // Hiển thị trắng khi đang load
  if (redirect) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-600 text-xl font-semibold">
        "Bạn không có quyền truy cập trang này"
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
