import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
  const location = useLocation();
  
  // Ambil token dari localStorage (Sesuaikan nama key-nya kalau beda ya bro)
  const token = localStorage.getItem('token'); 

  if (!token) {
    // Kalau nggak ada token, tendang ke login!
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kalau aman, render rute anak-anaknya (Cart, Checkout, dll)
  return <Outlet />;
}