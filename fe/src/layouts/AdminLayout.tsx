import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/Admin/HeaderAdmin";
import SidebarAdmin from "../components/Admin/SidebarAdmin";


const LayoutAdmin: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeaderAdmin />

      <div className="flex">
        <SidebarAdmin />

        <main className="flex-1 ml-64 mt-16 p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
