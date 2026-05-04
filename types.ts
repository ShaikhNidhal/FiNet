import React from 'react';

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Bill {
  vendor: string;
  due: string;
  amount: number;
}

export interface Invoice {
  customer: string;
  due: string;
  amount: number;
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