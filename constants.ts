

import { Transaction, Bill, Invoice, Theme, ThemeName } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
    { date: '2026-05-14', description: 'Client Payment - InTech', category: 'Revenue', gl: '4000', amount: 72000, type: 'income', status: 'posted', anomaly: null },
    { date: '2026-05-12', description: 'Interest Income', category: 'Interest', gl: '4500', amount: 2100, type: 'income', status: 'posted', anomaly: null },
    { date: '2026-05-10', description: 'Marketing Campaign - Meta Ads', category: 'Marketing', gl: '6100', amount: -15000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-05-07', description: 'Client Dinner', category: 'Meals & Entertainment', gl: '6400', amount: -5200, type: 'expense', status: 'posted', anomaly: 'High' },
    { date: '2026-05-03', description: 'Payroll - Engineering Team', category: 'Salaries', gl: '6600', amount: -92000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-05-02', description: 'AWS Cloud Services', category: 'Software & SaaS', gl: '6200', amount: -9100, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-05-01', description: 'Client Payment - Acme Corp Q2', category: 'Revenue', gl: '4000', amount: 145000, type: 'income', status: 'posted', anomaly: null },
    { date: '2026-04-30', description: 'Suspicious Transfer', category: 'Transfers', gl: '9000', amount: -45000, type: 'expense', status: 'pending', anomaly: 'Critical' },
    { date: '2026-04-25', description: 'Utilities', category: 'Utilities', gl: '6250', amount: -2300, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-04-15', description: 'License Revenue - SaaS Product', category: 'Revenue', gl: '4100', amount: 45000, type: 'income', status: 'posted', anomaly: null },
    { date: '2026-04-10', description: 'Vendor Payment - Contractor A', category: 'Professional Services', gl: '6300', amount: -24000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-04-05', description: 'Server Infrastructure', category: 'Software & SaaS', gl: '6200', amount: -7200, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-04-03', description: 'Payroll - All Staff', category: 'Salaries', gl: '6600', amount: -148000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-04-01', description: 'Client Payment - TechVision LLC', category: 'Revenue', gl: '4000', amount: 138000, type: 'income', status: 'posted', anomaly: null },
    { date: '2026-03-25', description: 'Duplicate Payment', category: 'Professional Services', gl: '6300', amount: -12000, type: 'expense', status: 'pending', anomaly: 'Critical' },
    { date: '2026-03-20', description: 'Office Equipment', category: 'Equipment', gl: '1500', amount: -13400, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-03-15', description: 'Vendor Payment - IT Services', category: 'Professional Services', gl: '6300', amount: -18000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-03-08', description: 'Consulting Revenue - Beta Co', category: 'Revenue', gl: '4000', amount: 38000, type: 'income', status: 'posted', anomaly: null },
    { date: '2026-03-03', description: 'Payroll - All Staff', category: 'Salaries', gl: '6600', amount: -148000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-03-01', description: 'Client Payment - MegaCorp', category: 'Revenue', gl: '4000', amount: 230000, type: 'income', status: 'posted', anomaly: null },
    { date: '2026-02-28', description: 'Q1 Tax Payment', category: 'Taxes', gl: '2600', amount: -35000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-02-20', description: 'Google Workspace', category: 'Software & SaaS', gl: '6200', amount: -850, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-02-14', description: 'Insurance Premium - Annual', category: 'Insurance', gl: '6400', amount: -9000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-02-10', description: 'Office Lease - Downtown HQ', category: 'Rent & Facilities', gl: '6700', amount: -12000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-01-25', description: 'Office Supplies - Staples', category: 'Office Supplies', gl: '6100', amount: -425, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-01-20', description: 'Marketing Campaign - LinkedIn', category: 'Marketing', gl: '6100', amount: -12000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-01-15', description: 'Travel Expenses - Sales Conference', category: 'Travel', gl: '6700', amount: -9000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-01-03', description: 'Payroll - All Staff', category: 'Salaries', gl: '6600', amount: -148000, type: 'expense', status: 'posted', anomaly: null },
    { date: '2026-01-01', description: 'Client Payment - Globex Inc', category: 'Revenue', gl: '4000', amount: 62000, type: 'income', status: 'posted', anomaly: null },
];

export const INITIAL_AP_BILLS: Bill[] = [
    { vendor: 'Innovate Tech Inc.', due: 'Aug 14, 2025', amount: 1250.00 },
    { vendor: 'Office Supplies Co.', due: 'Jul 28, 2025', amount: 345.20 }
];

export const INITIAL_AR_INVOICES: Invoice[] = [
    { customer: 'ClientCorp', due: 'Overdue by 5 days', amount: 5000.00 },
    { customer: 'Global Solutions Ltd.', due: 'Due in 10 days', amount: 12500.00 }
];

export const THEMES: Record<ThemeName, Theme> = {
    sky: { primary: '#0ea5e9', hover: '#0284c7', light: 'rgba(14, 165, 233, 0.1)' },
    rose: { primary: '#f43f5e', hover: '#e11d48', light: 'rgba(244, 63, 94, 0.1)' },
    emerald: { primary: '#10b981', hover: '#059669', light: 'rgba(16, 185, 129, 0.1)' },
    violet: { primary: '#8b5cf6', hover: '#7c3aed', light: 'rgba(139, 92, 246, 0.1)' }
};

export * from './constants.tsx';
