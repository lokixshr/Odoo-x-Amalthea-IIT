import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockExpenses } from '../utils/mockData';
import ExpenseTable from '../components/Common/ExpenseTable';
import StatusBadge from '../components/Common/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Search, Filter, Download, Eye, Calendar, DollarSign } from 'lucide-react';

const MyExpenses = () => {
  const { user } = useAuth();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter expenses for current employee
  const myExpenses = mockExpenses.filter(expense => 
    expense.employee === 'Mike Employee'
  );

  // Apply filters
  const filteredExpenses = myExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = [...new Set(myExpenses.map(expense => expense.category))];

  const ExpenseDetailsDialog = ({ expense }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Expense Details #{expense?.id}</DialogTitle>
        <DialogDescription>
          Submitted on {formatDate(expense?.submittedDate)}
        </DialogDescription>
      </DialogHeader>
      
      {expense && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Expense Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatCurrency(expense.amount, expense.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="outline">{expense.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{formatDate(expense.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <StatusBadge status={expense.status} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Approval Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Manager:</span>
                  <span>{expense.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span>{formatDate(expense.submittedDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{expense.description}</p>
          </div>

          {/* Approval History */}
          {expense.approvalHistory && expense.approvalHistory.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Approval History</h3>
              <div className="space-y-3">
                {expense.approvalHistory.map((approval, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{approval.approver}</p>
                        <p className="text-sm text-gray-500">{approval.step}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={approval.status} />
                        <p className="text-xs text-gray-500 mt-1">{formatDate(approval.date)}</p>
                      </div>
                    </div>
                    {approval.comment && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{approval.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receipt */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Receipt</h3>
            <div className="border rounded-lg p-4 text-center bg-gray-50">
              <p className="text-gray-600">Receipt: {expense.receipt}</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
        <p className="text-gray-600 mt-2">Track and manage your submitted expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submitted</p>
                <p className="text-2xl font-bold text-gray-900">${myExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{myExpenses.filter(e => e.status === 'Pending').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{myExpenses.filter(e => e.status === 'Approved').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">${(Math.random() * 2000 + 1000).toFixed(2)}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>All your submitted expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No expenses found matching your filters
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium text-gray-900">Date</th>
                      <th className="p-4 font-medium text-gray-900">Description</th>
                      <th className="p-4 font-medium text-gray-900">Category</th>
                      <th className="p-4 font-medium text-gray-900">Amount</th>
                      <th className="p-4 font-medium text-gray-900">Status</th>
                      <th className="p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{formatDate(expense.date)}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-gray-500">#{expense.id}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{expense.category}</Badge>
                        </td>
                        <td className="p-4 font-medium">{formatCurrency(expense.amount, expense.currency)}</td>
                        <td className="p-4">
                          <StatusBadge status={expense.status} />
                        </td>
                        <td className="p-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedExpense(expense)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <ExpenseDetailsDialog expense={selectedExpense} />
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyExpenses;