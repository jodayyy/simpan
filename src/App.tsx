import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthListener } from '@/hooks/useAuthListener';
import { useMonthlyReset } from '@/hooks/useMonthlyReset';
import { useFirestoreSync } from '@/hooks/useFirestoreSync';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Commitments from '@/pages/Commitments';
import Savings from '@/pages/Savings';
import Profile from '@/pages/Profile';
import ChangePassword from '@/pages/ChangePassword';

function App() {
  useAuthListener();
  useMonthlyReset();
  useFirestoreSync();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/commitments"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Commitments />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/savings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Savings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/change-password"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ChangePassword />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
