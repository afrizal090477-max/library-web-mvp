import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
// Import si Satpam! (Sesuaikan path-nya ya)
import { ProtectedRoute } from '@/routes/ProtectedRoute'; 

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import BookDetail from '@/pages/BookDetail'; 
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import BookList from '@/pages/BookList'; 
import Checkout from './pages/Checkout';
import AuthorDetail from './pages/AuthorDetail';
import Success from './pages/Success';


export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      // ==========================================
      // RUTE PUBLIK (Bebas diakses tanpa login)
      // ==========================================
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/books', element: <BookList /> },
      { path: '/books/:id', element: <BookDetail /> }, 
      { path: '/authors/:id', element: <AuthorDetail /> },
      
      // ==========================================
      // RUTE PRIVAT (Wajib punya Token Login!)
      // ==========================================
      {
        element: <ProtectedRoute />, // Satpamnya jaga di pintu ini
        children: [
          { path: '/profile', element: <Profile />},
          { path: '/cart', element: <Cart />},
          { path: '/checkout', element: <Checkout /> },
          { path: '/success', element: <Success /> },
        ]
      }
    ],
  },
]);