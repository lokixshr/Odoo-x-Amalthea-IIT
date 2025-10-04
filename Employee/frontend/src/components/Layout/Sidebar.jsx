import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Settings, 
  CheckCircle, 
  PlusCircle, 
  BarChart3,
  FileText,
  LogOut,
  Building
} from 'lucide-react';
import { Button } from '../ui/button';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'Admin':
        return [
          { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/users', icon: Users, label: 'User Management' },
          { path: '/approval-rules', icon: Settings, label: 'Approval Rules' },
          { path: '/company-expenses', icon: BarChart3, label: 'Company Expenses' },
        ];
      case 'Manager':
        return [
          { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/approvals', icon: CheckCircle, label: 'Approvals' },
          { path: '/team-expenses', icon: FileText, label: 'Team Expenses' },
        ];
      case 'Employee':
      default:
        return [
          { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/submit-expense', icon: PlusCircle, label: 'Submit Expense' },
          { path: '/my-expenses', icon: Receipt, label: 'My Expenses' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Building className="h-8 w-8 text-blue-600" />
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">ExpenseHub</h1>
              <p className="text-sm text-gray-500">Expense Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-3 rounded-lg transition-colors duration-200
              ${isActive 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          )}
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;