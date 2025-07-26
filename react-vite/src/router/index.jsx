//  OG CODE

// import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../components/SignupFormPage';
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
//     ],
//   },
// ]);



//? ------- OG Delete ----------------- 

// import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../components/SignupFormPage';
// import ProductFormPage from '../components/ProductFormPage';
// import ProductManagePage from '../components/ProductManage/ProductManagePage';
// import ProductShowPage from '../components/ProductShowPage/ProductShowPage';
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
import Layout from './Layout';

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
    ],
  },
]);