import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminLeaveTypes from './pages/admin/AdminLeaveTypes';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminLeaveApplications from './pages/admin/AdminLeaveApplications';
import AdminChangePassword from './pages/admin/AdminChangePassword';

import EmployeeLayout from './layouts/EmployeeLayout';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import ChangePassword from './pages/employee/ChangePassword';

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 🔐 Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="departments" element={<AdminDepartments />} />
              <Route path="leave-types" element={<AdminLeaveTypes />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="leave-applications" element={<AdminLeaveApplications />} />
              <Route path="change-password" element={<AdminChangePassword />} />
            </Route>
          </Route>

          {/* 🔐 Employee Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route path="my-profile" element={<EmployeeProfile />} />
              <Route path="apply-leave" element={<ApplyLeave />} />
              <Route path="leave-history" element={<LeaveHistory />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
