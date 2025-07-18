import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoriteProvider } from "./contexts/FavoriteContext";
import { CartProvider } from "./contexts/CartContext";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
     <BrowserRouter>
        <AuthProvider>
           <CartProvider>
            <FavoriteProvider>
              <App />
            </FavoriteProvider>
            </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
