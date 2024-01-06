import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root, { loader as rootLoader, action as rootAction } from './routes/root';
import ErrorPage from './error-page';
import Home from './routes/home';
import Tag from './routes/tag';
import './assets/fonts/gilmer-regular/gilmer-regular.css';
import './assets/fonts/gilmer-bold/gilmer-bold.css';
import './assets/fonts/gilmer-heavy/gilmer-heavy.css';
import './assets/fonts/gilmer-light/gilmer-light.css';
import './assets/fonts/gilmer-medium/gilmer-medium.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tag",
        element: <Tag />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
