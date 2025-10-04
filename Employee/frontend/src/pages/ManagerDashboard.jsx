import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockExpenses, getExpenseSummary } from '../utils/mockData';
import StatsCards from '../components/Common/StatsCards';
import ExpenseTable from '../components/Common/ExpenseTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const stats = getExpenseSummary('Manager');
  
  // Filter expenses for manager's team
  const teamExpenses = mockExpenses.filter(expense => expense.manager === 'Sarah Manager');
  const pendingApprovals = teamExpenses.filter(expense => expense.status === 'Pending');
  const recentExpenses = teamExpenses.slice(0, 5);

  const quickStats = [
    {
      title: 'Team Members',
      value: '8',
      icon: Users,
      description: 'Active team members',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals.length,
      icon: Clock,
      description: 'Awaiting your approval',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Approved Today',
      value: '3',
      icon: CheckCircle,
      description: 'Expenses approved today',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Monthly Budget',
      value: '85%',
      icon: TrendingUp,
      description: 'Budget utilization',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}. Manage your team's expenses efficiently.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approvals Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Expenses awaiting your approval</CardDescription>
          </div>
          <Button>View All Approvals</Button>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending approvals at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.slice(0, 3).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {expense.employee.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.employee} • {expense.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${expense.amount}</p>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Pending
                      </Badge>
                    </div>
                    <div className="space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Expenses Overview */}
      <StatsCards stats={stats} userRole="Manager" />

      {/* Recent Team Expenses */}
      <ExpenseTable
        expenses={recentExpenses}
        title="Recent Team Expenses"
        description="Latest expense submissions from your team members"
        showEmployee={true}
        onViewDetails={(expense) => console.log('View expense:', expense)}
      />
    </div>
  );
};

export default ManagerDashboard;