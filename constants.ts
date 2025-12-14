import { Template } from './types';

// Using a public Google Sample Sheet (Class Data) for demonstration purposes if user doesn't have their own yet.
// Replaced with placeholders for production.
const DEMO_SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // Public "Class Data" sheet

export const TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Sales Tracker Dashboard',
    category: 'Sales',
    price: 299,
    description: 'Track daily cash, UPI, and card sales with region-wise breakdown and profit margins.',
    features: ['Daily/Monthly Views', 'Payment Mode Split', 'Profit & Margin Calc', 'Branch Tracking'],
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    spreadsheetId: DEMO_SPREADSHEET_ID,
    sheetRange: 'Class Data!A1:F15',
    sampleTableName: 'preview_sales'
  },
  {
    id: '2',
    title: 'GST-Ready Expense Tracker',
    category: 'Finance',
    price: 299,
    description: 'Ensure compliance with auto-calculated CGST, SGST, IGST and GSTR-3B summary.',
    features: ['GSTIN Validation Logic', 'Vendor Management', 'Tax Split Auto-calc', 'Monthly Summary'],
    color: 'bg-green-100 text-green-700 border-green-200',
    spreadsheetId: DEMO_SPREADSHEET_ID,
    sheetRange: 'Class Data!A1:F15',
    sampleTableName: 'preview_expenses'
  },
  {
    id: '3',
    title: 'Smart Inventory Dashboard',
    category: 'Operations',
    price: 299,
    description: 'Prevent stock-outs and identify dead stock with automated low-stock alerts.',
    features: ['Opening/Closing Stock', 'Low-Stock Alerts', 'Dead Stock Analysis', 'Purchase Tracking'],
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    spreadsheetId: DEMO_SPREADSHEET_ID,
    sheetRange: 'Class Data!A1:F15',
    sampleTableName: 'preview_inventory'
  },
  {
    id: '4',
    title: 'HR Attendance & Payroll',
    category: 'HR',
    price: 299,
    description: 'Manage staff attendance, late marks, leaves, and auto-calculate month-end salaries.',
    features: ['Daily Attendance Grid', 'Leave Management', 'Late Mark Penalties', 'Salary Slip Gen'],
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    spreadsheetId: DEMO_SPREADSHEET_ID,
    sheetRange: 'Class Data!A1:F15',
    sampleTableName: 'preview_payroll'
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert Indian SME Business Consultant for "VyapaarExcel". 
Your goal is to assist business owners in understanding how Excel/Power BI templates can solve their operational problems.
You have deep knowledge of:
1. GST Regulations in India (CGST/SGST/IGST).
2. Indian SME Challenges (Cash flow, lack of tech skills, manual errors).
3. The specific templates we sell: Sales Tracker, GST Expense Tracker, Inventory Dashboard, HR Attendance.

When answering:
- Use Indian context (Lakhs, Crores, ₹).
- Be practical and execution-oriented.
- If asked about "Template Design" or technical details, provide column names and formulas suitable for Excel.
- If asked about "Strategy", focus on the provided business context: Subscription model (₹999/mo) or Single (₹299).

Strictly follow these predefined tasks if asked:
- TASK 1: Design (Columns, formulas).
- TASK 2: Realism (GST rules, Indian context).
- TASK 3: Differentiation (Why pay vs free).
- TASK 5: Launch Strategy (WhatsApp marketing, etc.).
- TASK 6: Legal (Disclaimers).
`;

export const SUGGESTED_QUESTIONS = [
  "How should I structure the Sales Tracker?",
  "What are the GST rules for the Expense Tracker?",
  "Give me a 30-day launch strategy.",
  "What is the best way to market on WhatsApp?"
];