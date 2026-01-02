import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuthStore from './store/authStore';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';

// Customer Protected Pages
import MyBookings from './pages/MyBookings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminDamages from './pages/admin/AdminDamages';
import AdminMaintenance from './pages/admin/AdminMaintenance';
// import AdminUsers from './pages/admin/AdminUsers';

// Component to redirect admins away from customer pages
const CustomerOnlyRoute = ({ children }) => {
  const { user } = useAuthStore();

  // If admin, redirect to admin panel
  if (user?.role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Site Routes - Uses regular Layout with navbar/footer */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes - Accessible to everyone including admins */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Customer-only Routes - Admins get redirected */}
          <Route
            path="cars"
            element={
              <CustomerOnlyRoute>
                <Cars />
              </CustomerOnlyRoute>
            }
          />
          <Route
            path="cars/:id"
            element={
              <CustomerOnlyRoute>
                <CarDetails />
              </CustomerOnlyRoute>
            }
          />

          {/* Protected Customer Routes - Only for authenticated customers */}
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <CustomerOnlyRoute>
                  <MyBookings />
                </CustomerOnlyRoute>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Panel Routes - Uses AdminLayout with sidebar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Dashboard - Default route */}
          <Route index element={<AdminDashboard />} />

          {/* Admin Sub-routes - Uncomment as you create these pages */}
          <Route path="cars" element={<AdminCars />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="damages" element={<AdminDamages />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          {/* <Route path="users" element={<AdminUsers />} /> */}
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;