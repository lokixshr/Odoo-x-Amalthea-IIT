import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockCategories, mockOCRExtraction } from '../utils/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Upload, Camera, DollarSign, Calendar, FileText, User, AlertCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const SubmitExpense = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    receipt: null,
    merchantName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ocrExtracted, setOcrExtracted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, receipt: file }));
      
      // Mock OCR extraction
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          amount: mockOCRExtraction.amount.toString(),
          date: mockOCRExtraction.date,
          merchantName: mockOCRExtraction.merchant,
          category: mockOCRExtraction.category
        }));
        setOcrExtracted(true);
        toast({
          title: "Receipt Processed!",
          description: "We've extracted information from your receipt. Please review and confirm.",
        });
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission
    setTimeout(() => {
      toast({
        title: "Expense Submitted!",
        description: "Your expense has been submitted for approval.",
      });
      
      // Reset form
      setFormData({
        amount: '',
        currency: 'USD',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        receipt: null,
        merchantName: ''
      });
      setOcrExtracted(false);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submit Expense</h1>
        <p className="text-gray-600 mt-2">Create a new expense report with receipt upload</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
                <CardDescription>Fill in the expense information below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Receipt Upload */}
                <div className="space-y-2">
                  <Label>Receipt Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        {formData.receipt ? (
                          <div className="flex items-center justify-center space-x-2">
                            <FileText className="h-8 w-8 text-green-500" />
                            <span className="text-green-600 font-medium">{formData.receipt.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-gray-600">Click to upload receipt</p>
                              <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  {ocrExtracted && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Information extracted from receipt - please verify</span>
                    </div>
                  )}
                </div>

                {/* Amount and Currency */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Expense Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Merchant Name */}
                <div className="space-y-2">
                  <Label htmlFor="merchantName">Merchant Name</Label>
                  <Input
                    id="merchantName"
                    type="text"
                    placeholder="e.g., Starbucks, Uber, Amazon"
                    value={formData.merchantName}
                    onChange={(e) => handleInputChange('merchantName', e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the business purpose of this expense"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Expense"}
                  </Button>
                  <Button type="button" variant="outline" className="px-6">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Employee Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Submitter</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">Engineering</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="font-medium">{user?.manager || 'Sarah Manager'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Expense Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">Receipt Required</p>
                <p className="text-gray-600">All expenses over $25 require a receipt</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Business Purpose</p>
                <p className="text-gray-600">Clearly describe the business justification</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Approval Limits</p>
                <p className="text-gray-600">
                  • Under $500: Manager approval
                  <br />
                  • Over $500: Finance approval required
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockCategories.slice(0, 6).map(category => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => handleInputChange('category', category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitExpense;