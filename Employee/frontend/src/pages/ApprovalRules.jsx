import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { PlusCircle, Settings, Users, DollarSign, CheckCircle } from 'lucide-react';

const ApprovalRules = () => {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Standard Approval Flow',
      description: 'Default approval process for most expenses',
      steps: [
        { step: 1, role: 'Manager', condition: 'All expenses', required: true },
        { step: 2, role: 'Finance', condition: 'Amount > $500', required: false },
        { step: 3, role: 'Director', condition: 'Amount > $2000', required: false }
      ],
      active: true
    },
    {
      id: 2,
      name: 'Travel Expenses',
      description: 'Special approval flow for travel-related expenses',
      steps: [
        { step: 1, role: 'Manager', condition: 'All travel expenses', required: true },
        { step: 2, role: 'HR', condition: 'Travel > 3 days', required: false },
        { step: 3, role: 'Finance', condition: 'Amount > $1000', required: false }
      ],
      active: true
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    category: 'All',
    thresholds: [
      { min: 0, max: 500, approvers: ['Manager'] },
      { min: 500, max: 2000, approvers: ['Manager', 'Finance'] },
      { min: 2000, max: 999999, approvers: ['Manager', 'Finance', 'Director'] }
    ]
  });

  const approverRoles = ['Manager', 'Finance', 'HR', 'Director', 'CFO', 'CEO'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Approval Rules Configuration</h1>
        <p className="text-gray-600 mt-2">Set up approval workflows and spending thresholds</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{rules.filter(r => r.active).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Steps</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approver Roles</p>
                <p className="text-2xl font-bold text-purple-600">{approverRoles.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Max Threshold</p>
                <p className="text-2xl font-bold text-orange-600">$2,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Current Approval Rules</CardTitle>
            <CardDescription>Active approval workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  <Badge variant={rule.active ? "default" : "secondary"} className={rule.active ? "bg-green-100 text-green-800" : ""}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Approval Steps:</p>
                  {rule.steps.map((step) => (
                    <div key={step.step} className="flex items-center space-x-2 text-sm">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {step.step}
                      </div>
                      <span className="font-medium">{step.role}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{step.condition}</span>
                      {step.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    {rule.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Create New Rule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Approval Rule
            </CardTitle>
            <CardDescription>Set up a new approval workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input
                placeholder="e.g., Marketing Expenses"
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of this rule"
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newRule.category} onValueChange={(value) => setNewRule({...newRule, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Meals">Meals</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Approval Thresholds</Label>
              {newRule.thresholds.map((threshold, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Label className="text-xs">Min Amount</Label>
                      <Input
                        type="number"
                        value={threshold.min}
                        onChange={(e) => {
                          const updatedThresholds = [...newRule.thresholds];
                          updatedThresholds[index].min = parseInt(e.target.value);
                          setNewRule({...newRule, thresholds: updatedThresholds});
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Max Amount</Label>
                      <Input
                        type="number"
                        value={threshold.max === 999999 ? '' : threshold.max}
                        placeholder="No limit"
                        onChange={(e) => {
                          const updatedThresholds = [...newRule.thresholds];
                          updatedThresholds[index].max = e.target.value ? parseInt(e.target.value) : 999999;
                          setNewRule({...newRule, thresholds: updatedThresholds});
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Required Approvers</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {threshold.approvers.map((approver) => (
                        <Badge key={approver} variant="outline" className="text-xs">
                          {approver}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Create Rule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Approver Management */}
      <Card>
        <CardHeader>
          <CardTitle>Approver Roles</CardTitle>
          <CardDescription>Manage who can approve expenses at different levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approverRoles.map((role) => (
              <div key={role} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{role}</h3>
                  <Badge variant="outline">
                    {role === 'Manager' ? '8 users' : 
                     role === 'Finance' ? '3 users' : 
                     role === 'HR' ? '2 users' : '1 user'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {role === 'Manager' ? 'Approve team expenses up to $500' :
                   role === 'Finance' ? 'Approve expenses over $500' :
                   role === 'HR' ? 'Approve travel and training expenses' :
                   role === 'Director' ? 'Approve high-value expenses' :
                   'Executive approval for major expenses'}
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Manage Users
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalRules;