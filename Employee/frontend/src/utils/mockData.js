// Mock data for expense management system

export const mockUsers = [
  { id: 1, name: "John Admin", email: "admin@company.com", role: "Admin", manager: null },
  { id: 2, name: "Sarah Manager", email: "sarah@company.com", role: "Manager", manager: "John Admin" },
  { id: 3, name: "Mike Employee", email: "mike@company.com", role: "Employee", manager: "Sarah Manager" },
  { id: 4, name: "Lisa Employee", email: "lisa@company.com", role: "Employee", manager: "Sarah Manager" },
  { id: 5, name: "David Finance", email: "david@company.com", role: "Manager", manager: "John Admin" },
];

export const mockExpenses = [
  {
    id: 1,
    amount: 125.50,
    currency: "USD",
    category: "Travel",
    description: "Uber ride to client meeting",
    date: "2024-12-15",
    status: "Pending",
    employee: "Mike Employee",
    manager: "Sarah Manager",
    receipt: "receipt1.jpg",
    submittedDate: "2024-12-15T09:30:00Z",
    approvalHistory: []
  },
  {
    id: 2,
    amount: 89.99,
    currency: "USD",
    category: "Meals",
    description: "Team lunch meeting",
    date: "2024-12-14",
    status: "Approved",
    employee: "Lisa Employee",
    manager: "Sarah Manager",
    receipt: "receipt2.jpg",
    submittedDate: "2024-12-14T14:20:00Z",
    approvalHistory: [
      { step: "Manager", approver: "Sarah Manager", status: "Approved", date: "2024-12-14T16:30:00Z", comment: "Approved for client meeting" }
    ]
  },
  {
    id: 3,
    amount: 450.00,
    currency: "USD",
    category: "Office Supplies",
    description: "New laptop accessories",
    date: "2024-12-13",
    status: "Rejected",
    employee: "Mike Employee",
    manager: "Sarah Manager",
    receipt: "receipt3.jpg",
    submittedDate: "2024-12-13T11:15:00Z",
    approvalHistory: [
      { step: "Manager", approver: "Sarah Manager", status: "Rejected", date: "2024-12-13T17:45:00Z", comment: "Please get pre-approval for expenses over $400" }
    ]
  },
  {
    id: 4,
    amount: 1200.00,
    currency: "USD",
    category: "Travel",
    description: "Flight to conference",
    date: "2024-12-12",
    status: "Pending",
    employee: "Lisa Employee",
    manager: "Sarah Manager",
    receipt: "receipt4.jpg",
    submittedDate: "2024-12-12T08:00:00Z",
    approvalHistory: [
      { step: "Manager", approver: "Sarah Manager", status: "Approved", date: "2024-12-12T10:30:00Z", comment: "Approved, forwarding to Finance" }
    ]
  }
];

export const mockCategories = [
  "Travel",
  "Meals",
  "Office Supplies",
  "Software",
  "Marketing",
  "Training",
  "Entertainment",
  "Accommodation"
];

export const mockApprovalRules = [
  {
    id: 1,
    name: "Standard Approval",
    steps: ["Manager", "Finance"],
    thresholds: [
      { min: 0, max: 500, approvers: ["Manager"] },
      { min: 500, max: 2000, approvers: ["Manager", "Finance"] },
      { min: 2000, max: 999999, approvers: ["Manager", "Finance", "Director"] }
    ]
  }
];

export const mockCurrentUser = {
  id: 3,
  name: "Mike Employee",
  email: "mike@company.com", 
  role: "Employee",
  manager: "Sarah Manager",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
};

// Expense summary statistics
export const getExpenseSummary = (userRole, userId = null) => {
  let filteredExpenses = mockExpenses;
  
  if (userRole === "Employee" && userId) {
    filteredExpenses = mockExpenses.filter(expense => expense.employee === mockUsers.find(u => u.id === userId)?.name);
  } else if (userRole === "Manager") {
    filteredExpenses = mockExpenses.filter(expense => expense.manager === "Sarah Manager");
  }

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pending = filteredExpenses.filter(exp => exp.status === "Pending").length;
  const approved = filteredExpenses.filter(exp => exp.status === "Approved").length;
  const rejected = filteredExpenses.filter(exp => exp.status === "Rejected").length;

  return { total, pending, approved, rejected, totalExpenses: filteredExpenses.length };
};

// Mock OCR extraction
export const mockOCRExtraction = {
  amount: 156.78,
  date: "2024-12-15",
  merchant: "Starbucks Coffee",
  category: "Meals"
};