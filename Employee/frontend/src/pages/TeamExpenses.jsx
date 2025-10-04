import React, { useState } from 'react';
import { mockExpenses, getExpenseSummary } from '../utils/mockData';
import ExpenseTable from '../components/Common/ExpenseTable';
import StatsCards from '../components/Common/StatsCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Download, Filter, TrendingUp, Calendar } from 'lucide-react';

const TeamExpenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');

  // Filter expenses for manager's team
  const teamExpenses = mockExpenses.filter(expense => expense.manager === 'Sarah Manager');
  const stats = getExpenseSummary('Manager');

  // Apply filters
  const filteredExpenses = teamExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesEmployee = employeeFilter === 'all' || expense.employee === employeeFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesEmployee;
  });

  // Chart data - expenses by team member
  const teamMemberData = [
    { name: 'Mike Employee', expenses: 1865.50, count: 3 },
    { name: 'Lisa Employee', expenses: 1289.99, count: 2 },
    { name: 'Alex Johnson', expenses: 890.25, count: 4 },
    { name: 'Sarah Wilson', expenses: 1450.75, count: 3 }
  ];

  const categories = [...new Set(teamExpenses.map(expense => expense.category))];
  const employees = [...new Set(teamExpenses.map(expense => expense.employee))];

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Expense History</h1>
          <p className="text-gray-600 mt-2">Monitor and analyze your team's expense patterns</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Team Report
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} userRole="Manager" />

      {/* Team Overview & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Members
            </CardTitle>
            <CardDescription>Expense summary by team member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMemberData.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.count} expenses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(member.expenses)}</p>
                  <Badge variant="outline" className="text-xs">This month</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expense Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Expense Distribution</CardTitle>
            <CardDescription>Expense amounts by team member this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamMemberData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Total Expenses']} />
                <Bar dataKey="expenses" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder="Search expenses or employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Team Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team Members</SelectItem>
                {employees.map(employee => (
                  <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <p className="text-2xl font-bold text-blue-600">1.8 days</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>15% faster than last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                ✓
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Expenses with proper documentation</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                <p className="text-2xl font-bold text-orange-600">68%</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                📊
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Of monthly team budget</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <ExpenseTable
        expenses={filteredExpenses}
        title="Team Expense History"
        description={`Showing ${filteredExpenses.length} of ${teamExpenses.length} team expenses`}
        showEmployee={true}
        onViewDetails={(expense) => console.log('View expense:', expense)}
      />
    </div>
  );
};

export default TeamExpenses;