import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import AdminLayout from '@/pages/admin/AdminLayout'; 
import { ProtectedRoute } from '@/routes/ProtectedRoute'; 

// Import Pages
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

// Import Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUserList } from './pages/admin/AdminUserList';
import { AdminBookList } from './pages/admin/AdminBookList';
import { AdminAddBook } from './pages/admin/AdminAddBook';
import { AdminLoanList } from './pages/admin/AdminLoanList';
import { AdminEditBook } from './pages/admin/AdminEditBook';
import { AdminPreviewBook } from './pages/admin/AdminPreviewBook';
import { AdminProfile } from './pages/admin/AdminProfile';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/books', element: <BookList /> },
      { path: '/books/:id', element: <BookDetail /> }, 
      { path: '/authors/:id', element: <AuthorDetail /> },
      
      {
        element: <ProtectedRoute />, 
        children: [
          { path: '/profile', element: <Profile />},
          { path: '/cart', element: <Cart />},
          { path: '/checkout', element: <Checkout /> },
          { path: '/success', element: <Success /> },
        ]
      }
    ],
  },

  {
    path: '/admin',
    element: <AdminLayout />, 
    children: [
      {
        element: <ProtectedRoute />, 
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'books', element: <AdminBookList /> },
          { path: 'users', element: <AdminUserList /> },
          { path: 'books/add', element: <AdminAddBook /> },
          { path: 'loans', element: <AdminLoanList /> },
          { path: 'books/edit/:id', element: <AdminEditBook /> },
          { path: 'books/:id', element: <AdminPreviewBook /> },
          { path: 'profile', element: <AdminProfile /> },
        ]
      }
    ],
  }
]);