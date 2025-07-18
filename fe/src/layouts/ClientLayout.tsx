import React from "react";
import Header from "../components/Client/Header";
import Footer from "../components/Client/Footer";
import { Outlet } from "react-router-dom";

const LayoutClient: React.FC = () => (
  <div className="bg-accent text-text font-sans min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default LayoutClient;
