//?   -------- OG PROD CRUD  --------------------

// import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../components/SignupFormPage';
// import ProductFormPage from '../components/ProductFormPage';
// import ProductManagePage from '../components/ProductManage/ProductManagePage';
// import ProductShowPage from '../components/ProductShowPage/ProductShowPage';
// import ProductUpdatePage from '../components/ProductUpdatePage/ProductUpdatePage'; 
// import Layout from './Layout';

// export const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <h1>Welcome!</h1>,
//       },
//       {
//         path: "login",
//         element: <LoginFormPage />,
//       },
//       {
//         path: "signup",
//         element: <SignupFormPage />,
//       },
//       {
//         path: "products/new",
//         element: <ProductFormPage />,
//       },
//       {
//         path: "products/manage",
//         element: <ProductManagePage />,
//       },
//       {
//         path: "products/:productId",
//         element: <ProductShowPage />,
//       },
//       {
//         path: "products/:productId/edit",
//         element: <ProductUpdatePage />,
//       },
//     ],
//   },
// ]);


import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ProductFormPage from '../components/ProductFormPage';
import ProductManagePage from '../components/ProductManage/ProductManagePage';
import ProductShowPage from '../components/ProductShowPage/ProductShowPage';
import ProductUpdatePage from '../components/ProductUpdatePage/ProductUpdatePage';
import ShoppingCart from '../components/ShoppingCart/ShoppingCart';
import ProductList from '../components/ProductList/ProductList';
import WishlistPage from '../components/WishlistPage/WishlistPage';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute'; // this is for wishlist only showing witha logged in user

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProductList />,
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
      {
        path: "products/:productId/edit",
        element: <ProductUpdatePage />,
      },
      {
        path: "cart",
        element: <ShoppingCart />,
      },
      {
        path: "products",
        element: <ProductList />,
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