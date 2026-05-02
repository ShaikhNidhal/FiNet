

import { Transaction, Bill, Invoice, Theme, ThemeName } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
    { date: '2025-07-12', description: 'Stripe Payout', amount: 7500.00, type: 'income', category: 'Sales Revenue' },
    { date: '2025-07-11', description: 'Amazon Web Services', amount: -450.75, type: 'expense', category: 'Cloud & Hosting' },
    { date: '2025-07-10', description: 'HubSpot Subscription', amount: -200.00, type: 'expense', category: 'Software & Subscriptions' },
    { date: '2025-07-09', description: 'Office Depot', amount: -112.45, type: 'expense', category: 'Office Supplies' },
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
