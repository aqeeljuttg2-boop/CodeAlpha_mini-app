/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { Home } from '../pages/Home';
import { Explore } from '../pages/Explore';
import { Messages } from '../pages/Messages';
import { Notifications } from '../pages/Notifications';
import { Profile } from '../pages/Profile';
import { SettingsPage } from '../pages/Settings';

import { Register } from '../pages/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'explore',
        element: <Explore />,
      },
      {
        path: 'messages',
        element: <Messages />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'profile/:username',
        element: <Profile />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
export default router;
