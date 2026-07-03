import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import BookDetail from '@/pages/BookDetail'; 
import Profile from './pages/Profile';
import Cart from './pages/Cart';

// 1. IMPORT KOMPONEN BOOKLIST YANG BARU KITA BUAT
import BookList from '@/pages/BookList'; 
import Checkout from './pages/Checkout';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/books', element: <BookList /> },
      { path: '/books/:id', element: <BookDetail /> }, 
      { path: '/profile', element: <Profile />},
      { path: '/cart', element: <Cart />},
      { path: '/checkout', element: <Checkout /> },
{ path: '/success', element: <div className="pt-32 text-2xl font-bold text-center">Halaman Success akan kita buat! 🚀</div> },
    ],
  },
]);