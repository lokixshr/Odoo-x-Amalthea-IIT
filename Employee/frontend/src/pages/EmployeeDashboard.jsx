import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockExpenses, getExpenseSummary } from '../utils/mockData';
import StatsCards from '../components/Common/StatsCards';
import ExpenseTable from '../components/Common/ExpenseTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { PlusCircle, Receipt, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const stats = getExpenseSummary('Employee', user?.id);
  
  // Filter expenses for current employee
  const myExpenses = mockExpenses.filter(expense => 
    expense.employee === 'Mike Employee'
  );
  const recentExpenses = myExpenses.slice(0, 5);

  // Mock monthly budget data
  const monthlyBudget = {
    total: 2000,
    used: 1250,
    remaining: 750
  };
  const budgetPercentage = (monthlyBudget.used / monthlyBudget.total) * 100;

  const quickActions = [
    {
      title: 'Submit New Expense',
      description: 'Create a new expense report',
      icon: PlusCircle,
      color: 'bg-blue-600 hover:bg-blue-700',
      link: '/submit-expense'
    },
    {
      title: 'View My Expenses',
      description: 'See all your submitted expenses',
      icon: Receipt,
      color: 'bg-green-600 hover:bg-green-700',
      link: '/my-expenses'
    },
    {
      title: 'Monthly Report',
      description: 'Generate expense report',
      icon: Calendar,
      color: 'bg-purple-600 hover:bg-purple-700',
      link: '/reports'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}. Track and submit your expenses easily.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats and Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatsCards stats={stats} userRole="Employee" />
        </div>
        
        {/* Monthly Budget Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Monthly Budget
            </CardTitle>
            <CardDescription>Your expense budget for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: ${monthlyBudget.used}</span>
                <span>Total: ${monthlyBudget.total}</span>
              </div>
              <Progress value={budgetPercentage} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{budgetPercentage.toFixed(1)}% used</span>
                <span>${monthlyBudget.remaining} remaining</span>
              </div>
            </div>
            
            {budgetPercentage > 80 && (
              <div className="flex items-center text-amber-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Approaching budget limit</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Expenses Alert */}
      {stats.pending > 0 && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">
                  You have {stats.pending} expense{stats.pending !== 1 ? 's' : ''} pending approval
                </h3>
                <p className="text-blue-700 text-sm">
                  Your expenses are being reviewed by your manager. You'll be notified once approved.
                </p>
              </div>
              <Link to="/my-expenses">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Expenses */}
      <ExpenseTable
        expenses={recentExpenses}
        title="My Recent Expenses"
        description="Your latest expense submissions"
        showEmployee={false}
        onViewDetails={(expense) => console.log('View expense:', expense)}
      />

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Expense Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Quick Submission</h4>
              <p className="text-gray-600">Upload receipt photos for automatic data extraction and faster processing.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Categorization</h4>
              <p className="text-gray-600">Use correct categories to help with budget tracking and tax reporting.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Approval Times</h4>
              <p className="text-gray-600">Most expenses under $500 are approved within 24 hours.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Budget Tracking</h4>
              <p className="text-gray-600">Monitor your monthly spending to stay within company limits.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;