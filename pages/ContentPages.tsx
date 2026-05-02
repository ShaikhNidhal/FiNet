import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ThemeContext, DataContext } from '../App';
import { ThemeContextType, DataContextType, ThemeName, Transaction } from '../types';
import { THEMES } from '../constants';

const KpiCard: React.FC<{ title: string; value: string; colorClass: string }> = ({ title, value, colorClass }) => (
    <div className="kpi-card bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

export const DashboardPage: React.FC = () => {
    const themeContext = useContext(ThemeContext) as ThemeContextType;
    const { themeColors, isDarkMode } = themeContext;

    const cashFlowData = [
        { name: 'Jan', Inflow: 50, Outflow: 40 },
        { name: 'Feb', Inflow: 60, Outflow: 45 },
        { name: 'Mar', Inflow: 75, Outflow: 50 },
        { name: 'Apr', Inflow: 80, Outflow: 55 },
        { name: 'May', Inflow: 70, Outflow: 60 },
        { name: 'Jun', Inflow: 90, Outflow: 65 },
        { name: 'Jul', Inflow: 105, Outflow: 70 },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Cash Balance" value="$125,730.55" colorClass="text-[var(--color-primary)]" />
                <KpiCard title="Net Income (YTD)" value="$48,210.90" colorClass="text-emerald-600" />
                <KpiCard title="Inventory Value" value="$82,450.00" colorClass="text-slate-800 dark:text-slate-200" />
                <KpiCard title="Pending Expenses" value="$2,150.75" colorClass="text-rose-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Cash Flow Forecast</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cashFlowData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }} />
                                <YAxis tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }} />
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#334155' : '#fff', border: '1px solid #374151' }} />
                                <Legend wrapperStyle={{ color: isDarkMode ? '#cbd5e1' : '#475569' }} />
                                <Line type="monotone" dataKey="Inflow" stroke={themeColors.hover} fill={themeColors.light} />
                                <Line type="monotone" dataKey="Outflow" stroke="#e11d48" fill="rgba(225, 29, 72, 0.1)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">FiNet Insights</h3>
                    <div className="space-y-4">
                        <div className="flex items-start"><span className="text-emerald-500 text-xl mr-3">▲</span><div><h4 className="font-semibold text-slate-800 dark:text-slate-200">Positive Trend</h4><p className="text-sm text-slate-500 dark:text-slate-400">Sales revenue has increased by 15% month-over-month.</p></div></div>
                        <div className="flex items-start"><span className="text-amber-500 text-xl mr-3">!</span><div><h4 className="font-semibold text-slate-800 dark:text-slate-200">Anomaly Detected</h4><p className="text-sm text-slate-500 dark:text-slate-400">Software spending is 30% higher than the 3-month average. Review recent subscriptions.</p></div></div>
                        <div className="flex items-start"><span className="text-sky-500 text-xl mr-3">→</span><div><h4 className="font-semibold text-slate-800 dark:text-slate-200">Forecast</h4><p className="text-sm text-slate-500 dark:text-slate-400">Based on current trends, you are projected to exceed your Q3 profit target by 8%.</p></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DataExtractionPage: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const dataContext = useContext(DataContext) as DataContextType;
    const navigate = useNavigate();

    const handleUpload = () => {
        setIsProcessing(true);
        setIsComplete(false);
        setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
        }, 2000);
    };
    
    const handleAddToTransactions = () => {
        const newTransaction: Transaction = { date: '2025-07-15', description: 'Innovate Tech Inc.', amount: -1250.00, type: 'expense', category: 'Software & Subscriptions' };
        dataContext.setTransactions(prev => [newTransaction, ...prev]);
        navigate('/transactions');
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Upload a Document</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Simulate uploading an invoice, receipt, or bank statement. FiNet will analyze the document and extract the key data points automatically.</p>
            <div className="flex items-center justify-center w-full mb-8">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600" onClick={handleUpload}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12a4 4 0 014 4v1.586a1 1 0 01-.293.707l-1.414 1.414a1 1 0 00-.707.293H7z"></path></svg>
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Simulated: PDF, PNG, JPG</p>
                    </div>
                    <input id="file-upload" type="button" className="hidden" />
                </label>
            </div>
            
            {(isProcessing || isComplete) && (
                <div>
                    {isProcessing && (
                        <div className="text-center p-8">
                            <div className="loader mx-auto"></div>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium">FiNet is analyzing document...</p>
                        </div>
                    )}
                    {isComplete && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-emerald-600">Data Extracted Successfully!</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Vendor</label><input type="text" value="Innovate Tech Inc." className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-slate-100 dark:bg-slate-600" readOnly /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Invoice Date</label><input type="text" value="2025-07-15" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-slate-100 dark:bg-slate-600" readOnly /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Total Amount</label><input type="text" value="$1,250.00" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-slate-100 dark:bg-slate-600" readOnly /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label><input type="text" value="2025-08-14" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-slate-100 dark:bg-slate-600" readOnly /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label><input type="text" value="Annual Cloud Hosting Subscription" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-slate-100 dark:bg-slate-600" readOnly /></div>
                            </div>
                            <div className="mt-6 text-right"><button onClick={handleAddToTransactions} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition">Add to Transactions</button></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const TransactionsPage: React.FC = () => {
    const dataContext = useContext(DataContext) as DataContextType;

    const handleApprove = (indexToRemove: number) => {
        dataContext.setTransactions(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Review & Reconcile</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">FiNet has automatically categorized new transactions. Review the suggestions and approve to reconcile your books.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">FiNet Suggested Category</th>
                            <th scope="col" className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataContext.transactions.map((tx, index) => (
                            <tr key={index} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                <td className="px-6 py-4">{tx.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{tx.description}</td>
                                <td className={`px-6 py-4 font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {tx.type === 'expense' ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{tx.category}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleApprove(index)} className="font-medium text-emerald-600 hover:underline">Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pnl');
    const themeContext = useContext(ThemeContext) as ThemeContextType;
    const { themeColors, isDarkMode } = themeContext;

    const reports = {
        pnl: { name: 'Profit & Loss' },
        balanceSheet: { name: 'Balance Sheet' },
        cashFlow: { name: 'Cash Flow Statement' }
    };

    const pnlData = [
        { name: 'Jan', Revenue: 30, 'Net Income': 5 },
        { name: 'Feb', Revenue: 35, 'Net Income': 7 },
        { name: 'Mar', Revenue: 42, 'Net Income': 10 },
        { name: 'Apr', Revenue: 45, 'Net Income': 12 },
        { name: 'May', Revenue: 40, 'Net Income': 8 },
        { name: 'Jun', Revenue: 50, 'Net Income': 15 },
        { name: 'Jul', Revenue: 58, 'Net Income': 21 },
    ];
    
    const balanceSheetData = [
      { name: 'Amount', Assets: 150000, Liabilities: 75000, Equity: 75000 }
    ];
    
    const balanceSheetColors = [themeColors.primary, '#f97316', '#10b981'];

    const renderContent = () => {
        switch (activeTab) {
            case 'pnl':
                return (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Profit & Loss (YTD)</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pnlData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                    <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }} />
                                    <YAxis tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }} />
                                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#334155' : '#fff', border: '1px solid #374151' }} />
                                    <Legend wrapperStyle={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}/>
                                    <Bar dataKey="Revenue" fill={themeColors.primary} />
                                    <Bar dataKey="Net Income" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            case 'balanceSheet':
                return (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Balance Sheet (as of Jul 15, 2025)</h3>
                        <div className="h-96">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={balanceSheetData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                    <XAxis type="number" tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }} />
                                    <YAxis type="category" dataKey="name" tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b' }} />
                                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#334155' : '#fff', border: '1px solid #374151' }} />
                                    <Legend wrapperStyle={{ color: isDarkMode ? '#cbd5e1' : '#475569' }} />
                                    <Bar dataKey="Assets" fill={balanceSheetColors[0]} />
                                    <Bar dataKey="Liabilities" fill={balanceSheetColors[1]} />
                                    <Bar dataKey="Equity" fill={balanceSheetColors[2]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            case 'cashFlow':
                 return (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Cash Flow Statement (YTD)</h3>
                        <p className="text-center text-slate-500 dark:text-slate-400 pt-16">Detailed Cash Flow Statement table would be displayed here.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="mb-6">
                <div className="hidden sm:block">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {Object.entries(reports).map(([key, { name }]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === key ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export const WorkflowsPage: React.FC = () => {
    const dataContext = useContext(DataContext) as DataContextType;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Accounts Payable</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Review and approve upcoming bills.</p>
                <div className="space-y-4">
                    {dataContext.apBills.map((bill, index) => (
                        <div key={index} className="p-4 border dark:border-slate-700 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{bill.vendor}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Due: {bill.due}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-rose-600">${bill.amount.toFixed(2)}</p>
                                <button className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full mt-1 hover:bg-emerald-600">Approve</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Accounts Receivable</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Track outstanding invoices.</p>
                <div className="space-y-4">
                    {dataContext.arInvoices.map((invoice, index) => (
                        <div key={index} className="p-4 border dark:border-slate-700 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{invoice.customer}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{invoice.due}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-emerald-600">${invoice.amount.toFixed(2)}</p>
                                <button className="text-xs bg-[var(--color-primary)] text-white px-2 py-1 rounded-full mt-1 hover:bg-[var(--color-primary-hover)]">Send Reminder</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const BudgetingPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Budget vs. Actuals</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Track your spending against your budget in real-time. FiNet flags categories that are over budget.</p>
        <div className="space-y-6">
            <div><div className="flex justify-between mb-1"><span className="text-base font-medium text-slate-700 dark:text-slate-300">Marketing</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">$10,500 / $10,000 <span className="text-rose-500 font-bold">(105%)</span></span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4"><div className="bg-rose-500 h-4 rounded-full" style={{ width: '100%' }}></div></div></div>
            <div><div className="flex justify-between mb-1"><span className="text-base font-medium text-slate-700 dark:text-slate-300">Software & Subscriptions</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">$1,800 / $2,000 (90%)</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4"><div className="bg-amber-500 h-4 rounded-full" style={{ width: '90%' }}></div></div></div>
            <div><div className="flex justify-between mb-1"><span className="text-base font-medium text-slate-700 dark:text-slate-300">Cloud & Hosting</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">$600 / $1,000 (60%)</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4"><div className="bg-emerald-500 h-4 rounded-full" style={{ width: '60%' }}></div></div></div>
        </div>
    </div>
);

export const IntegrationsPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Seamless Integrations</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Connect your favorite business tools to create a single source of truth for your financial data.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 border dark:border-slate-700 rounded-lg flex flex-col items-center justify-center"><img src="https://picsum.photos/seed/payroll/64" className="rounded-full mb-3" alt="Payroll Icon" /><p className="font-semibold text-slate-800 dark:text-slate-200">Payroll Systems</p><button className="mt-2 text-sm text-[var(--color-primary)] font-semibold">Connect</button></div>
            <div className="p-6 border dark:border-slate-700 rounded-lg flex flex-col items-center justify-center"><img src="https://picsum.photos/seed/crm/64" className="rounded-full mb-3" alt="CRM Icon" /><p className="font-semibold text-slate-800 dark:text-slate-200">CRM Platforms</p><button className="mt-2 text-sm text-[var(--color-primary)] font-semibold">Connect</button></div>
            <div className="p-6 border dark:border-slate-700 rounded-lg flex flex-col items-center justify-center"><img src="https://picsum.photos/seed/stripe/64" className="rounded-full mb-3" alt="Stripe Icon" /><p className="font-semibold text-slate-800 dark:text-slate-200">Payment Gateways</p><button className="mt-2 text-sm text-[var(--color-primary)] font-semibold">Connect</button></div>
            <div className="p-6 border dark:border-slate-700 rounded-lg flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700 opacity-70"><img src="https://picsum.photos/seed/hris/64" className="rounded-full mb-3" alt="HRIS Icon" /><p className="font-semibold text-slate-800 dark:text-slate-200">HRIS</p><button className="mt-2 text-sm text-slate-500 cursor-not-allowed">Coming Soon</button></div>
        </div>
    </div>
);

export const SettingsPage: React.FC = () => {
    const themeContext = useContext(ThemeContext) as ThemeContextType;
    const { themeName, isDarkMode, applyTheme, toggleDarkMode } = themeContext;

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto space-y-8">
            <div><h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Settings</h2><p className="text-slate-500 dark:text-slate-400 mt-1">Customize your FiNet workspace.</p></div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Appearance</h3>
                <div className="mt-4 flex items-center space-x-4">
                    <span className="text-slate-600 dark:text-slate-400">Light</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-[var(--color-primary-hover)] rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                    <span className="text-slate-600 dark:text-slate-400">Dark</span>
                </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Color Theme</h3>
                <div className="mt-4 flex items-center space-x-4">
                    {(Object.keys(THEMES) as ThemeName[]).map(name => (
                        <button
                            key={name}
                            onClick={() => applyTheme(name)}
                            className={`w-8 h-8 rounded-full bg-${name}-500 transition-all ${themeName === name ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-[var(--color-primary)]' : ''}`}
                            style={{ backgroundColor: THEMES[name].primary }}
                        ></button>
                    ))}
                </div>
            </div>
             <div className="border-t border-slate-200 dark:border-slate-700 pt-6"><h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Multi-Currency</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage finances across different currencies.</p><div className="mt-4 space-y-4"><label className="block"><span className="text-slate-700 dark:text-slate-300">Base Currency</span><select className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"><option>USD - United States Dollar</option><option>EUR - Euro</option><option>GBP - British Pound</option></select></label></div></div>
        </div>
    );
};


// The following are simple placeholder pages.
export const ExpenseManagementPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Expense Reports</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">Submit New Report</button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-500 dark:text-slate-400"><thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700"><tr><th scope="col" className="px-6 py-3">Report ID</th><th scope="col" className="px-6 py-3">Submitted By</th><th scope="col" className="px-6 py-3">Amount</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3 text-center">Action</th></tr></thead><tbody>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">ER-2025-003</td><td className="px-6 py-4">Alice Johnson</td><td className="px-6 py-4">$450.50</td><td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Approved</span></td><td className="px-6 py-4 text-center"><a href="#" className="font-medium text-[var(--color-primary)] hover:underline">View</a></td>
        </tr>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">ER-2025-002</td><td className="px-6 py-4">Bob Williams</td><td className="px-6 py-4">$1,200.00</td><td className="px-6 py-4"><span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Pending Approval</span></td><td className="px-6 py-4 text-center"><a href="#" className="font-medium text-[var(--color-primary)] hover:underline">Review</a></td>
        </tr>
    </tbody></table></div></div>
);

export const InventoryPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Inventory Management</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">Add New Item</button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-500 dark:text-slate-400"><thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700"><tr><th scope="col" className="px-6 py-3">Item Name</th><th scope="col" className="px-6 py-3">SKU</th><th scope="col" className="px-6 py-3">Stock Level</th><th scope="col" className="px-6 py-3">Reorder Point</th><th scope="col" className="px-6 py-3">Value</th></tr></thead><tbody>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">Pro Widget</td><td className="px-6 py-4">PW-001</td><td className="px-6 py-4 font-semibold">150 units</td><td className="px-6 py-4">100</td><td className="px-6 py-4">$7,500.00</td>
        </tr>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">Standard Gizmo</td><td className="px-6 py-4">SG-002</td><td className="px-6 py-4 font-semibold text-rose-500 flex items-center"><span className="w-2 h-2 mr-2 bg-rose-500 rounded-full"></span>45 units</td><td className="px-6 py-4">50</td><td className="px-6 py-4">$1,125.00</td>
        </tr>
    </tbody></table></div></div>
);

export const ProjectsPage: React.FC = () => (
    <div><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Project-Based Accounting</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">New Project</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow"><h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Website Redesign</h3><p className="text-sm text-slate-500 dark:text-slate-400 mb-4">ClientCorp</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Budget:</span><span className="font-semibold">$20,000</span></div><div className="flex justify-between"><span>Invoiced:</span><span className="font-semibold">$15,000</span></div><div className="flex justify-between pt-2 border-t dark:border-slate-700"><span>Profitability:</span><span className="font-bold text-emerald-500">45%</span></div></div></div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow"><h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Q3 Marketing Campaign</h3><p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Global Solutions Ltd.</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Budget:</span><span className="font-semibold">$50,000</span></div><div className="flex justify-between"><span>Invoiced:</span><span className="font-semibold">$50,000</span></div><div className="flex justify-between pt-2 border-t dark:border-slate-700"><span>Profitability:</span><span className="font-bold text-rose-500">-5%</span></div></div></div>
    </div></div>
);

export const FixedAssetsPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Fixed Asset Register</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">Add New Asset</button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-500 dark:text-slate-400"><thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700"><tr><th scope="col" className="px-6 py-3">Asset</th><th scope="col" className="px-6 py-3">Acquisition Date</th><th scope="col" className="px-6 py-3">Cost</th><th scope="col" className="px-6 py-3">Depreciation</th><th scope="col" className="px-6 py-3">Book Value</th></tr></thead><tbody>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">MacBook Pro 16"</td><td className="px-6 py-4">2024-01-15</td><td className="px-6 py-4">$2,500.00</td><td className="px-6 py-4">($416.67)</td><td className="px-6 py-4 font-semibold">$2,083.33</td>
        </tr>
    </tbody></table></div></div>
);

export const TaxCenterPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto"><h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-200">Tax Center</h2><p className="text-slate-500 dark:text-slate-400 mb-6">Stay on top of your tax obligations with AI-powered estimates and reports.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg text-center"><h3 className="text-slate-500 dark:text-slate-400 font-medium">Estimated Q3 Tax Due</h3><p className="text-4xl font-bold text-[var(--color-primary)] mt-2">$8,540.00</p><p className="text-xs text-slate-400 mt-1">Due: Sep 15, 2025</p></div>
        <div className="p-6 flex flex-col justify-center"><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Tax-Ready Reports</h3><div className="space-y-2"><button className="w-full text-left bg-slate-100 dark:bg-slate-700 p-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition">Generate P&L for Tax</button><button className="w-full text-left bg-slate-100 dark:bg-slate-700 p-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition">Export Expense Report</button></div></div>
    </div></div>
);

export const PayrollPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto"><div className="text-center"><h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-200">Run Payroll</h2><p className="text-slate-500 dark:text-slate-400 mb-6">Process payroll in minutes with our fully integrated system.</p></div><div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg mb-6"><div className="flex justify-between items-center"><h3 className="font-medium text-slate-600 dark:text-slate-300">Next Pay Run: <span className="font-bold text-slate-800 dark:text-slate-100">Jul 1 - Jul 15</span></h3><p className="text-slate-600 dark:text-slate-300">Pay Date: <span className="font-bold text-slate-800 dark:text-slate-100">Jul 20, 2025</span></p></div></div><div className="text-center"><p className="text-slate-500 dark:text-slate-400">Total Payroll Cost</p><p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 my-2">$45,820.50</p><button className="w-full max-w-xs mx-auto bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-emerald-700 transition duration-300 text-lg">Run Payroll</button></div></div>
);