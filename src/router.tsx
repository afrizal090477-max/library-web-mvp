import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';           // ← Import Home

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,                 // ← Ganti dengan <Home />
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
]);