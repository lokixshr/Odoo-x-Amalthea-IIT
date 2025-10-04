import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";

// Auth Components
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

// Layout Components
import MainLayout from "./components/Layout/MainLayout";

// Dashboard Components
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

// Page Components
import UserManagement from "./pages/UserManagement";
import ApprovalRules from "./pages/ApprovalRules";
import CompanyExpenses from "./pages/CompanyExpenses";
import Approvals from "./pages/Approvals";
import TeamExpenses from "./pages/TeamExpenses";
import SubmitExpense from "./pages/SubmitExpense";
import MyExpenses from "./pages/MyExpenses";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Dashboard Router based on user role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Manager':
      return <ManagerDashboard />;
    case 'Employee':
    default:
      return <EmployeeDashboard />;
  }
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardRouter />} />
              
              {/* Admin Routes */}
              <Route path="users" element={<UserManagement />} />
              <Route path="approval-rules" element={<ApprovalRules />} />
              <Route path="company-expenses" element={<CompanyExpenses />} />
              
              {/* Manager Routes */}
              <Route path="approvals" element={<Approvals />} />
              <Route path="team-expenses" element={<TeamExpenses />} />
              
              {/* Employee Routes */}
              <Route path="submit-expense" element={<SubmitExpense />} />
              <Route path="my-expenses" element={<MyExpenses />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
