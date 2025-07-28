import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import WishlistPage from '../components/WishlistPage';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute'; // this is for wishlist only showing witha logged in user

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "wishlist",
            element: <WishlistPage />,
          },
        ],
      },
    ],
  },
]);