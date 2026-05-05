
import React, { useState, useMemo, useCallback, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SubscriptionBanner from './components/SubscriptionBanner';
import LoginPage from './pages/LoginPage';
import { DashboardPage, ReportsPage, TransactionsPage, DataExtractionPage, WorkflowsPage, ExpenseManagementPage, InventoryPage, ProjectsPage, FixedAssetsPage, BudgetingPage, TaxCenterPage, PayrollPage, IntegrationsPage, SettingsPage, ScenarioPlanningPage, ESGReportingPage, MarketIntelligencePage, ReconciliationPage, RiskDiscoveryPage, ExecutiveInsightsPage, UserManagementPage, AutonomousBookkeepingPage } from './pages/ContentPages';
import { ThemeName, ThemeContextType, DataContextType, Transaction, Bill, Invoice } from './types';
import { THEMES, INITIAL_TRANSACTIONS, INITIAL_AP_BILLS, INITIAL_AR_INVOICES, SIDEBAR_SECTIONS } from './constants';

export const ThemeContext = createContext<ThemeContextType | null>(null);
export const DataContext = createContext<DataContextType | null>(null);

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const location = useLocation();
    const link = SIDEBAR_SECTIONS.flatMap(s => s.links).find(l => l.href === location.pathname);
    const pageTitle = link ? link.label : 'Dashboard';

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar onLogout={onLogout} />
            <main className="flex-1 flex flex-col min-w-0">
                <SubscriptionBanner />
                <Header title={pageTitle} />
                <div className="p-6 md:p-10 overflow-y-auto flex-grow bg-[var(--bg-main)]">
                    <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/executive-insights" element={<ExecutiveInsightsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/autonomous-bookkeeping" element={<AutonomousBookkeepingPage />} />
                        <Route path="/reconciliation" element={<ReconciliationPage />} />
                        <Route path="/risk-discovery" element={<RiskDiscoveryPage />} />
                        <Route path="/data-extraction" element={<DataExtractionPage />} />
                        <Route path="/workflows" element={<WorkflowsPage />} />
                        <Route path="/expense-management" element={<ExpenseManagementPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/fixed-assets" element={<FixedAssetsPage />} />
                        <Route path="/budgeting" element={<BudgetingPage />} />
                        <Route path="/scenario-planning" element={<ScenarioPlanningPage />} />
                        <Route path="/esg-reporting" element={<ESGReportingPage />} />
                        <Route path="/tax-center" element={<TaxCenterPage />} />
                        <Route path="/payroll" element={<PayrollPage />} />
                        <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
                        <Route path="/integrations" element={<IntegrationsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/user-management" element={<UserManagementPage />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />

                    </Routes>
                </div>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [themeName, setThemeName] = useState<ThemeName>('sky');
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('finet_transactions');
        return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    });
    const [apBills] = useState<Bill[]>(INITIAL_AP_BILLS);
    const [arInvoices] = useState<Invoice[]>(INITIAL_AR_INVOICES);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    }, [isLoggedIn]);

    useEffect(() => {
        localStorage.setItem('finet_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const applyTheme = useCallback((name: ThemeName) => {
        setThemeName(name);
        const theme = THEMES[name];
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-primary-hover', theme.hover);
        root.style.setProperty('--color-primary-light', theme.light);
    }, []);
    
    useEffect(() => {
        applyTheme('sky'); // Apply default theme on initial load
    }, [applyTheme]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    const themeContextValue = useMemo(() => ({
        themeName,
        isDarkMode,
        applyTheme,
        toggleDarkMode,
        themeColors: THEMES[themeName],
    }), [themeName, isDarkMode, applyTheme, toggleDarkMode]);

    const [baseCurrency, setBaseCurrency] = useState(() => localStorage.getItem('finet_base_currency') || 'USD');
    
    useEffect(() => {
        localStorage.setItem('finet_base_currency', baseCurrency);
    }, [baseCurrency]);

    const dataContextValue = useMemo(() => ({
        transactions,
        setTransactions,
        apBills,
        arInvoices,
        baseCurrency,
        setBaseCurrency,
    }), [transactions, apBills, arInvoices, baseCurrency]);

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    return (
        <ThemeContext.Provider value={themeContextValue}>
            <DataContext.Provider value={dataContextValue}>
                <Routes>
                    <Route
                        path="/login"
                        element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
                    />
                    <Route
                        path="/*"
                        element={isLoggedIn ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                </Routes>
            </DataContext.Provider>
        </ThemeContext.Provider>
    );
};

export default App;
