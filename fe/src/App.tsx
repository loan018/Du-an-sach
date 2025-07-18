import React from "react";
import { useRoutes } from "react-router-dom";
import LayoutAdmin from "./layouts/AdminLayout";
import "./index.css";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UserList from "./pages/Admin/Auth/userList";
import RequireAdmin from "./components/Admin/RequiAdmin";
import BannerList from "./pages/Admin/Banner/bannerList";
import BannerAdd from "./pages/Admin/Banner/bannerAdd";
import BannerEdit from "./pages/Admin/Banner/bannerEdit";
import CategoryList from "./pages/Admin/Category/categoryList";
import CategoryAdd from "./pages/Admin/Category/categoryAdd";
import CategoryEdit from "./pages/Admin/Category/categoryEdit";
import BookList from "./pages/Admin/Book/bookList";
import BookAdd from "./pages/Admin/Book/bookAdd";
import BookEdit from "./pages/Admin/Book/bookEdit";
import OrderList from "./pages/Admin/Order/orderList";
import OrderDetail from "./pages/Admin/Order/orderEdit";
import ReviewList from "./pages/Admin/Review/ReviewList";
import AdminSearchResult from "./pages/Admin/Seach";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";

import Home from "./pages/Client/Home";
import LayoutClient from "./layouts/ClientLayout";
import BookDetail from "./pages/Client/BookDetail";
import UserProfile from "./pages/Client/UserProfile";
import Cart from "./pages/Client/Cart";
import Favorites from "./pages/Client/Favorites";
import Checkout from "./pages/Client/Checkout";
import Search from "./pages/Client/Search";
import Book from "./pages/Client/Bookist";
import Order from "./pages/Client/Order";
import AddressBook from "./pages/Client/Add";
import ProfileInfo from "./pages/Client/ProfileInfo";
import AddressForm from "./pages/Client/AddEdit";
import OrderSuccess from "./pages/Client/orderlist";
import OrderDetaill from "./pages/Client/OrderDetail";
import ContactList from "./pages/Admin/Lienhe/lienhelist";
import LienHe from "./pages/Client/lienhe";
import LienHeList from "./pages/Client/lienhelist";
import LienHeEdit from "./pages/Client/lienheedit";
import ChangePassword from "./pages/Client/Password";

function App() {
  const routes = useRoutes([
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    {
      path: "/admin",
      element: (
        <RequireAdmin>
          <LayoutAdmin />
        </RequireAdmin>
      ),
      children: [
        { path: "", element: <AdminDashboard /> },
        { path: "user", element: <UserList /> },
        { path: "banner", element: <BannerList /> },
        { path: "banner/add", element: <BannerAdd /> },
        { path: "banner/edit/:id", element: <BannerEdit /> },
        { path: "category", element: <CategoryList /> },
        { path: "category/add", element: <CategoryAdd /> },
        { path: "category/edit/:id", element: <CategoryEdit /> },
        { path: "book", element: <BookList /> },
        { path: "book/add", element: <BookAdd /> },
        { path: "book/edit/:id", element: <BookEdit /> },
        { path: "order", element: <OrderList /> },
        { path: "order/:id", element: <OrderDetail /> },
        { path: "review", element: <ReviewList /> },
        { path: "/admin/search", element: <AdminSearchResult /> },
        { path: "lienhe", element: <ContactList /> },
      ],
    },
    {
      path: "/",
      element: <LayoutClient />,
      children: [
        { path: "", element: <Home /> },
        {
          path: "profile",
          element: <UserProfile />,
          children: [
            { index: true, element: <ProfileInfo /> },
            { path: "orders", element: <Order /> },
            { path: "address", element: <AddressBook /> },
            { path: "address/edit/:id", element: <AddressForm /> },
            { path: "change-password", element: <ChangePassword /> },
          ],
        },

        { path: "checkout", element: <Checkout /> },
        { path: "book", element: <Book /> },
        { path: "book/:id", element: <BookDetail /> },
        { path: "yeuthich", element: <Favorites /> },
        { path: "cart", element: <Cart /> },
        { path: "order", element: <Order /> },
        { path: "tìmkiem", element: <Search /> },
        { path: "list", element: <OrderSuccess /> },
        { path: "order/:id", element: <OrderDetaill /> },
        { path: "contact", element: <LienHeList /> },
        { path: "contact/add", element: <LienHe /> },
        { path: "contact/edit/:id", element: <LienHeEdit /> },
      ],
    },
  ]);

  return routes;
}

export default App;
