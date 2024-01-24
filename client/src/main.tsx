import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './error-page';
import Home from './routes/home';
import Tag, { loader as branchesLoader } from './routes/tag';
import TagSnapAdmin, { loader as snapDetailLoader } from './routes/tagSnapAdmin';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tag",
        element: <Tag />,
        loader: branchesLoader,
      },
      {
        path: "/admin/tag/:branchCode",
        element: <TagSnapAdmin />,
        loader: snapDetailLoader,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="870321804177-748ml4ol2lija9fief4t8qcnanuqttc2.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
