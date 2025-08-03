import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ProductFormPage from '../components/ProductFormPage';
import ProductManagePage from '../components/ProductManage/ProductManagePage';
import ProductShowPage from '../components/ProductShowPage/ProductShowPage';
import WishlistPage from '../components/WishlistPage/WishlistPage';
import AllProductsPage from '../components/AllProductsPage/AllProductsPage';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Landing page
      {
        path: "/",
        element: (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1>Welcome to Banned Genre</h1>
            <p><em>Where ghouls go bump in the night!</em></p>
          </div>
        ),
      },

      // Auth routes
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },

      // Product-related routes
      {
        path: "products",
        element: <AllProductsPage />,
      },
      {
        path: "products/new",
        element: <ProductFormPage />,
      },
      {
        path: "products/manage",
        element: <ProductManagePage />,
      },
      {
        path: "products/:productId",
        element: <ProductShowPage />,
      },

      // Protected routes
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