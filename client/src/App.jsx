import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import LikesPage from "./pages/LikesPage";
import CartPage from "./pages/CartPage";
import CollectionsPage from "./pages/CollectionsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

// Admin Subsystem Imports
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public & Customer Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/likes" element={<LikesPage />} />
        <Route path="/my_cart" element={<CartPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Dedicated Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}