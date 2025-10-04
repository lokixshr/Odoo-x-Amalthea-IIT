import React, { useState } from 'react';
import { mockExpenses } from '../utils/mockData';
import StatusBadge from '../components/Common/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, DollarSign } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Approvals = () => {
  const [pendingExpenses, setPendingExpenses] = useState(
    mockExpenses.filter(expense => expense.status === 'Pending' && expense.manager === 'Sarah Manager')
  );
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [comment, setComment] = useState('');

  const handleApproval = (expenseId, action, comment = '') => {
    setPendingExpenses(prev => 
      prev.filter(expense => expense.id !== expenseId)
    );
    
    toast({
      title: action === 'approve' ? 'Expense Approved' : 'Expense Rejected',
      description: `Expense #${expenseId} has been ${action === 'approve' ? 'approved' : 'rejected'}`,
    });
    
    setComment('');
  };

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

  const ExpenseDetailsDialog = ({ expense }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Review Expense #{expense?.id}</DialogTitle>
        <DialogDescription>
          Submitted by {expense?.employee} on {formatDate(expense?.submittedDate)}
        </DialogDescription>
      </DialogHeader>
      
      {expense && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Expense Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(expense.amount, expense.currency)}</span>
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
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium">{expense.employee}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Receipt Information</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                    📄
                  </div>
                  <p className="text-sm font-medium">Receipt Available</p>
                  <p className="text-xs text-gray-500">{expense.receipt}</p>
                  <Button variant="outline" size="sm">View Receipt</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Business Purpose</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{expense.description}</p>
          </div>

          {/* Approval Actions */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Manager Decision</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Comment (Optional)
                </label>
                <Textarea
                  placeholder="Add any comments about this expense..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleApproval(expense.id, 'approve', comment)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Expense
                </Button>
                <Button
                  onClick={() => handleApproval(expense.id, 'reject', comment)}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Expense
                </Button>
              </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Expense Approvals</h1>
        <p className="text-gray-600 mt-2">Review and approve pending expense submissions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingExpenses.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-purple-600">2.1h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            {pendingExpenses.length} expenses awaiting your approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingExpenses.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500">No pending approvals at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingExpenses.map((expense) => (
                <div key={expense.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {expense.employee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                          <p className="text-sm text-gray-600">
                            Submitted by {expense.employee} on {formatDate(expense.submittedDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                          <p className="font-semibold text-lg">{formatCurrency(expense.amount, expense.currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                          <Badge variant="outline">{expense.category}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                          <p className="text-sm">{formatDate(expense.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                          <StatusBadge status={expense.status} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedExpense(expense)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <ExpenseDetailsDialog expense={selectedExpense} />
                    </Dialog>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(expense.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(expense.id, 'reject')}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Approval Activity</CardTitle>
          <CardDescription>Your recent approval decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 5, employee: 'John Smith', action: 'Approved', amount: 89.50, time: '2 hours ago' },
              { id: 6, employee: 'Emily Davis', action: 'Approved', amount: 156.00, time: '4 hours ago' },
              { id: 7, employee: 'Michael Chen', action: 'Rejected', amount: 250.00, time: '1 day ago' }
            ].map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.action === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">{activity.action}</span>
                  <span className="text-gray-600">expense from {activity.employee}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">${activity.amount}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Approvals;