import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard'
import { AppLayout } from '../layouts/AppLayout';

export const AppRoutes = () => {
  const { signed } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={!signed ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!signed ? <Register /> : <Navigate to="/dashboard" />} />

      <Route element={signed ? <AppLayout /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </BrowserRouter>
  );
};