import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import StoreLayout from '../components/layouts/StoreLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UserDashboard from '../pages/dashboard/UserDashboard';

// Admin Pages
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import ProductManagement from '../pages/products/ProductManagement';
import OrderManagement from '../pages/orders/OrderManagement';
import PaymentDashboard from '../pages/payments/PaymentDashboard';
import ProfilePage from '../pages/profile/ProfilePage';

// Authenticated Route wrapper
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Quick Commerce Storefront Routes */}
        <Route path="/" element={<StoreLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          
          {/* Normal Auth Routes (Storefront) */}
          <Route 
            path="checkout" 
            element={
              <AuthenticatedRoute>
                <CheckoutPage />
              </AuthenticatedRoute>
            } 
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Dashboard Routes (with Sidebar) */}
        <Route 
          path="/dashboard" 
          element={
            <AuthenticatedRoute>
              <DashboardLayout />
            </AuthenticatedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="payments" element={<PaymentDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
