import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import LikesPage from "./pages/LikesPage";
import CartPage from "./pages/CartPage";
import CollectionsPage from "./pages/CollectionsPage";
import ProductDetailPage from "./pages/ProductDetailPage";

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/likes" element={<LikesPage />} />
          <Route path="/my_cart" element={<CartPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

    </Router>
  );
}