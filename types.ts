import React from 'react';

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  currency?: string;
  type: 'income' | 'expense';
  category: string;
  gl?: string;
  status?: 'posted' | 'pending';
  anomaly?: 'Critical' | 'High' | 'Medium' | 'Low' | null;
}

export interface Bill {
  vendor: string;
  due: string;
  amount: number;
  currency?: string;
}

export interface Invoice {
  customer: string;
  due: string;
  amount: number;
  currency?: string;
}

export interface SidebarLink {
    href: string;
    label: string;
    icon: React.ReactNode;
}

export interface SidebarSection {
    title: string;
    links: SidebarLink[];
}

export type ThemeName = 'sky' | 'rose' | 'emerald' | 'violet';

export interface Theme {
    primary: string;
    hover: string;
    light: string;
}

export interface ThemeContextType {
    themeName: ThemeName;
    isDarkMode: boolean;
    applyTheme: (name: ThemeName) => void;
    toggleDarkMode: () => void;
    themeColors: Theme;
}

export interface DataContextType {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    apBills: Bill[];
    arInvoices: Invoice[];
    baseCurrency: string;
    setBaseCurrency: React.Dispatch<React.SetStateAction<string>>;
}

export interface SubscriptionStatus {
    isTrial: boolean;
    trialDaysRemaining: number;
    isExpired: boolean;
    isPro: boolean;
}

export type UserRole = 'Admin' | 'Finance Manager' | 'Analyst' | 'Employee';


export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'Active' | 'Invited' | 'Suspended';
}

export interface ExpenseReport {
    id: string;
    submittedBy: string;
    description: string;
    amount: number;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    category: string;
}