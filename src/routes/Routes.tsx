import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { useAuth } from '../hooks/useAuth';
import HomePage from '../pages/Home/Home';
import PrivateRoute from './RoutesPrivate';
import LoginPage from '../pages/Login/Login';
import UserListPage from '../pages/Master/UserList';
import UserEditPage from '../pages/Master/UserEdit';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/edit/:id" element={<UserEditPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default AppRoutes;
