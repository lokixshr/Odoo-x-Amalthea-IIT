import React, { useState } from 'react';
import { mockExpenses } from '../utils/mockData';
import ExpenseTable from '../components/Common/ExpenseTable';
import StatsCards from '../components/Common/StatsCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// import { DatePickerWithRange } from '../components/ui/date-picker';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Calendar, Users } from 'lucide-react';

const CompanyExpenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Apply filters
  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesEmployee = employeeFilter === 'all' || expense.employee === employeeFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesEmployee;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const stats = {
    total: totalAmount,
    pending: filteredExpenses.filter(e => e.status === 'Pending').length,
    approved: filteredExpenses.filter(e => e.status === 'Approved').length,
    rejected: filteredExpenses.filter(e => e.status === 'Rejected').length,
    totalExpenses: filteredExpenses.length
  };

  // Chart data
  const categoryData = [
    { name: 'Travel', value: 2450, color: '#3B82F6' },
    { name: 'Meals', value: 1200, color: '#10B981' },
    { name: 'Office Supplies', value: 800, color: '#F59E0B' },
    { name: 'Software', value: 600, color: '#EF4444' }
  ];

  const monthlyData = [
    { month: 'Jan', expenses: 4200 },
    { month: 'Feb', expenses: 3800 },
    { month: 'Mar', expenses: 5100 },
    { month: 'Apr', expenses: 4600 },
    { month: 'May', expenses: 5400 },
    { month: 'Jun', expenses: 4900 }
  ];

  const categories = [...new Set(mockExpenses.map(expense => expense.category))];
  const employees = [...new Set(mockExpenses.map(expense => expense.employee))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company-wide Expenses</h1>
          <p className="text-gray-600 mt-2">Monitor and analyze all company expenses</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} userRole="Admin" />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
            <CardDescription>Company expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar dataKey="expenses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Distribution by expense type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Input
                placeholder="Search expenses..."
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
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map(employee => (
                  <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Department Summary</CardTitle>
          <CardDescription>Expense breakdown by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { dept: 'Engineering', amount: 12500, count: 24, color: 'bg-blue-100 text-blue-800' },
              { dept: 'Sales', amount: 8900, count: 18, color: 'bg-green-100 text-green-800' },
              { dept: 'Marketing', amount: 6700, count: 15, color: 'bg-purple-100 text-purple-800' },
              { dept: 'Operations', amount: 4200, count: 12, color: 'bg-orange-100 text-orange-800' }
            ].map((dept) => (
              <div key={dept.dept} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{dept.dept}</h3>
                  <Badge className={dept.color}>{dept.count} expenses</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">${dept.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <ExpenseTable
        expenses={filteredExpenses}
        title="All Company Expenses"
        description={`Showing ${filteredExpenses.length} of ${mockExpenses.length} expenses`}
        showEmployee={true}
        onViewDetails={(expense) => console.log('View expense:', expense)}
      />
    </div>
  );
};

export default CompanyExpenses;