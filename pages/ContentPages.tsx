import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeContext, DataContext } from '../App';
import { ThemeContextType, DataContextType, ThemeName, Transaction } from '../types';
import { THEMES } from '../constants';

const NewKpiCard: React.FC<{ title: string; value: string; subtext: string; isPositive: boolean; icon: React.ReactNode }> = ({ title, value, subtext, isPositive, icon }) => (
    <div className="premium-card relative overflow-hidden flex flex-col justify-between p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                {icon}
            </div>
        </div>
        <div>
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : (subtext.includes('per month') ? 'text-slate-500' : 'text-rose-500')}`}>
                {subtext}
            </p>
        </div>
    </div>
);

export const DashboardPage: React.FC = () => {
    const cashFlowData = [
        { name: '2025-06', Inflow: 130000, Outflow: 160000 },
        { name: '2025-07', Inflow: 140000, Outflow: 155000 },
        { name: '2025-08', Inflow: 75000, Outflow: 155000 },
        { name: '2025-09', Inflow: 100000, Outflow: 165000 },
        { name: '2025-10', Inflow: 105000, Outflow: 175000 },
        { name: '2025-11', Inflow: 80000, Outflow: 185000 },
        { name: '2025-12', Inflow: 190000, Outflow: 200000 },
        { name: '2026-01', Inflow: 65000, Outflow: 175000 },
        { name: '2026-02', Inflow: 75000, Outflow: 60000 },
        { name: '2026-03', Inflow: 280000, Outflow: 180000 },
        { name: '2026-04', Inflow: 165000, Outflow: 230000 },
        { name: '2026-05', Inflow: 220000, Outflow: 120000 },
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column - Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-xl font-bold font-outfit text-white">Financial Dashboard</h2>
                        <p className="text-slate-500 text-sm mt-1">Real-time overview of your financial position</p>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <NewKpiCard 
                            title="CASH POSITION" 
                            value="$-361800" 
                            subtext="↘ -12.4% growth" 
                            isPositive={false} 
                            icon={<span className="font-bold text-sm">$</span>} 
                        />
                        <NewKpiCard 
                            title="TOTAL REVENUE" 
                            value="$1.59M" 
                            subtext="↗ YTD" 
                            isPositive={true} 
                            icon={<span className="font-bold text-sm">↗</span>} 
                        />
                        <NewKpiCard 
                            title="BURN RATE" 
                            value="$163K" 
                            subtext="per month" 
                            isPositive={true} 
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>} 
                        />
                        <NewKpiCard 
                            title="DAYS OUTSTANDING" 
                            value="6d" 
                            subtext="↗ avg receivables" 
                            isPositive={true} 
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
                        />
                    </div>

                    {/* Alert Banner */}
                    <div className="flex items-center gap-3 p-3 bg-rose-950/20 border border-rose-900/50 rounded-lg text-rose-500">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <p className="text-sm font-semibold">1 critical, 2 high severity anomalies require attention</p>
                    </div>

                    {/* Area Chart */}
                    <div className="premium-card">
                        <h3 className="text-sm font-bold font-outfit mb-6 text-white">Cash Flow — Last 12 Months</h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: '#64748b', fontSize: 10 }} 
                                        axisLine={false}
                                        tickLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#64748b', fontSize: 10 }} 
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `$${value/1000}K`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#0f172a', 
                                            borderRadius: '8px',
                                            border: '1px solid #1e293b',
                                            color: '#f8fafc'
                                        }} 
                                    />
                                    <Area type="monotone" dataKey="Outflow" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorOutflow)" />
                                    <Area type="monotone" dataKey="Inflow" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInflow)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="premium-card">
                        <h3 className="text-sm font-bold font-outfit mb-4 text-white">Recent Transactions</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <div>
                                    <p className="font-semibold text-white text-sm">AWS Cloud Services</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Software & SaaS • 2026-05-02</p>
                                </div>
                                <p className="font-bold text-white text-sm">-$9K</p>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <div>
                                    <p className="font-semibold text-white text-sm">Payroll - Engineering Team</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Salaries • 2026-05-03</p>
                                </div>
                                <p className="font-bold text-white text-sm">-$92K</p>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <div>
                                    <p className="font-semibold text-white text-sm">Business Meals - Client Dinner</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Meals & Entertainment • 2026-05-07</p>
                                </div>
                                <p className="font-bold text-white text-sm">-$5K</p>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <div>
                                    <p className="font-semibold text-white text-sm">Marketing Campaign - Meta Ads</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Marketing • 2026-05-10</p>
                                </div>
                                <p className="font-bold text-white text-sm">-$2K</p>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div>
                                    <p className="font-semibold text-white text-sm">Interest Income</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Interest • 2026-05-12</p>
                                </div>
                                <p className="font-bold text-emerald-500 text-sm">+$2K</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="xl:col-span-1 space-y-6 xl:pt-[4.5rem]">
                    {/* AI Strategic Insights */}
                    <div className="premium-card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold font-outfit text-white">AI Strategic Insights</h3>
                            <span className="px-2 py-1 bg-sky-500/10 text-sky-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Live</span>
                        </div>
                        <div className="space-y-6">
                            <div className="group cursor-default">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">↑</div>
                                    <h4 className="font-semibold text-white text-sm">Revenue Acceleration</h4>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-11">Month-over-month growth is exceeding projections by 15%. Recommend increasing marketing spend in Region A.</p>
                            </div>
                            <div className="group cursor-default">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold">!</div>
                                    <h4 className="font-semibold text-white text-sm">Subscription Bloat</h4>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-11">FiNet detected 3 overlapping SaaS subscriptions. Estimated savings: $420/month.</p>
                            </div>
                            <button className="w-full py-3 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-xl text-xs font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all mt-4">
                                Generate Full Audit Report
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Stacked */}
                    <div className="space-y-4">
                        <div className="premium-card flex items-center gap-4 p-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white leading-tight">10</p>
                                <p className="text-xs text-[var(--text-muted)]">Open Invoices</p>
                            </div>
                        </div>
                        <div className="premium-card flex items-center gap-4 p-4">
                            <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white leading-tight">5</p>
                                <p className="text-xs text-[var(--text-muted)]">Open Anomalies</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

import { geminiService } from '../services/geminiService';

export const DataExtractionPage: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const dataContext = useContext(DataContext) as DataContextType;
    const navigate = useNavigate();

    const handleUpload = async () => {
        setIsProcessing(true);
        setError(null);
        
        // In a real app, we'd read the file. 
        // For this integration demo, we'll simulate a document text.
        const mockDocText = "Invoice from Innovate Tech Inc. Date: 2025-07-15. Total: $1250.00. Description: Annual Cloud Hosting. Due: 2025-08-14.";
        
        try {
            const data = await geminiService.analyzeDocument(mockDocText);
            if (data) {
                setExtractedData({
                    vendor: data["Vendor/Customer Name"] || data.vendor,
                    date: data.Date || data.date,
                    amount: parseFloat(data["Total Amount"] || data.amount),
                    dueDate: data["Due Date"] || "2025-08-14",
                    description: data.Description || data.description,
                    category: data["Suggested Category"] || data.category
                });
            } else {
                setError("Failed to parse document. Please try again.");
            }
        } catch (err) {
            setError("AI Service error. Check your API key.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleAddToTransactions = () => {
        if (!extractedData) return;
        const newTransaction: Transaction = { 
            date: extractedData.date, 
            description: extractedData.vendor, 
            amount: -extractedData.amount, 
            type: 'expense', 
            category: extractedData.category 
        };
        dataContext.setTransactions(prev => [newTransaction, ...prev]);
        navigate('/transactions');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="premium-card text-center">
                <h2 className="text-2xl font-bold font-outfit mb-2">Intelligent Data Extraction</h2>
                <p className="text-[var(--text-muted)] mb-8">Upload any financial document. FiNet's AI will parse invoices and receipts with 99.9% accuracy.</p>
                
                <div 
                    className="flex flex-col items-center justify-center w-full h-72 border-2 border-[var(--border-color)] border-dashed rounded-2xl cursor-pointer bg-[var(--bg-main)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] transition-all group"
                    onClick={handleUpload}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12a4 4 0 014 4v1.586a1 1 0 01-.293.707l-1.414 1.414a1 1 0 00-.707.293H7z"></path></svg>
                        </div>
                        <p className="mb-2 text-sm text-[var(--text-main)]"><span className="font-bold">Drop your invoice here</span> or click to browse</p>
                        <p className="text-xs text-[var(--text-muted)]">Supports PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                </div>
            </div>
            
            {isProcessing && (
                <div className="premium-card text-center py-12">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium animate-pulse">Gemini AI is analyzing document...</p>
                </div>
            )}

            {extractedData && !isProcessing && (
                <div className="premium-card border-t-4 border-t-emerald-500 animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-emerald-600">Verification Result</h3>
                        <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-bold">98% Confidence</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailField label="Vendor" value={extractedData.vendor} />
                        <DetailField label="Invoice Date" value={extractedData.date} />
                        <DetailField label="Total Amount" value={`$${extractedData.amount.toFixed(2)}`} isBold />
                        <DetailField label="Due Date" value={extractedData.dueDate} />
                        <div className="md:col-span-2">
                            <DetailField label="AI Description" value={extractedData.description} />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button className="px-6 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Discard</button>
                        <button onClick={handleAddToTransactions} className="btn-primary">Approve & Add to Books</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailField: React.FC<{ label: string; value: string; isBold?: boolean }> = ({ label, value, isBold }) => (
    <div>
        <label className="block text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">{label}</label>
        <p className={`text-sm ${isBold ? 'font-bold' : 'font-medium'}`}>{value}</p>
    </div>
);

export const TransactionsPage: React.FC = () => {
    const transactions = [
        { date: '2026-05-14', description: 'Client Payment - InTech', category: 'Revenue', gl: '4000', amount: 72000, status: 'posted', anomaly: null },
        { date: '2026-05-12', description: 'Interest Income', category: 'Interest', gl: '4500', amount: 2100, status: 'posted', anomaly: null },
        { date: '2026-05-10', description: 'Marketing Campaign - Meta Ads', category: 'Marketing', gl: '6100', amount: -15000, status: 'posted', anomaly: null },
        { date: '2026-05-07', description: 'Business Meals - Client Dinner', category: 'Meals & Entertainment', gl: '6400', amount: -5200, status: 'posted', anomaly: 'High' },
        { date: '2026-05-03', description: 'Payroll - Engineering Team', category: 'Salaries', gl: '6600', amount: -92000, status: 'posted', anomaly: null },
        { date: '2026-05-02', description: 'AWS Cloud Services', category: 'Software & SaaS', gl: '6200', amount: -9100, status: 'posted', anomaly: null },
        { date: '2026-05-01', description: 'Client Payment - Acme Corp Q2', category: 'Revenue', gl: '4000', amount: 145000, status: 'posted', anomaly: null },
        { date: '2026-04-30', description: 'Cash Transfer - Suspicious', category: 'Transfers', gl: '9000', amount: -45000, status: 'pending', anomaly: 'Critical' },
        { date: '2026-04-25', description: 'Utilities', category: 'Utilities', gl: '6250', amount: -2300, status: 'posted', anomaly: null },
        { date: '2026-04-15', description: 'License Revenue - SaaS Product', category: 'Revenue', gl: '4100', amount: 45000, status: 'posted', anomaly: null },
        { date: '2026-04-10', description: 'Vendor Payment - Contractor A', category: 'Professional Services', gl: '6300', amount: -24000, status: 'posted', anomaly: null },
        { date: '2026-04-05', description: 'Server Infrastructure', category: 'Software & SaaS', gl: '6200', amount: -7200, status: 'posted', anomaly: null },
        { date: '2026-04-03', description: 'Payroll - All Staff', category: 'Salaries', gl: '6600', amount: -148000, status: 'posted', anomaly: null },
        { date: '2026-04-01', description: 'Client Payment - TechVision LLC', category: 'Revenue', gl: '4000', amount: 138000, status: 'posted', anomaly: null },
        { date: '2026-03-25', description: 'Duplicate Payment - Vendor B', category: 'Professional Services', gl: '6300', amount: -12000, status: 'pending', anomaly: 'Critical' },
        { date: '2026-03-20', description: 'Office Equipment', category: 'Equipment', gl: '1500', amount: -13400, status: 'posted', anomaly: null },
        { date: '2026-03-15', description: 'Vendor Payment - IT Services', category: 'Professional Services', gl: '6300', amount: -18000, status: 'posted', anomaly: null },
        { date: '2026-03-08', description: 'Consulting Revenue - Beta Co', category: 'Revenue', gl: '4000', amount: 38000, status: 'posted', anomaly: null },
        { date: '2026-03-03', description: 'Payroll - All Staff', category: 'Salaries', gl: '6600', amount: -148000, status: 'posted', anomaly: null },
        { date: '2026-03-01', description: 'Client Payment - MegaCorp', category: 'Revenue', gl: '4000', amount: 230000, status: 'posted', anomaly: null },
        { date: '2026-02-28', description: 'Q1 Tax Payment', category: 'Taxes', gl: '2600', amount: -35000, status: 'posted', anomaly: null },
        { date: '2026-02-20', description: 'Google Workspace', category: 'Software & SaaS', gl: '6200', amount: -850, status: 'posted', anomaly: null },
        { date: '2026-02-14', description: 'Insurance Premium - Annual', category: 'Insurance', gl: '6400', amount: -9000, status: 'posted', anomaly: null },
        { date: '2026-02-10', description: 'Office Lease - Downtown HQ', category: 'Rent & Facilities', gl: '6700', amount: -12000, status: 'posted', anomaly: null },
        { date: '2026-02-01', description: 'Client Payment - SpringBoard', category: 'Revenue', gl: '4000', amount: 88000, status: 'posted', anomaly: null },
        { date: '2026-01-25', description: 'Office Supplies - Staples', category: 'Office Supplies', gl: '6100', amount: -425, status: 'posted', anomaly: null },
        { date: '2026-01-20', description: 'Marketing Campaign - LinkedIn', category: 'Marketing', gl: '6100', amount: -12000, status: 'posted', anomaly: null },
        { date: '2026-01-15', description: 'Travel Expenses - Sales Conference', category: 'Travel', gl: '6700', amount: -9000, status: 'posted', anomaly: null },
        { date: '2026-01-03', description: 'Payroll - All Staff', category: 'Salaries', gl: '6600', amount: -148000, status: 'posted', anomaly: null },
        { date: '2026-01-01', description: 'Client Payment - Globex Inc', category: 'Revenue', gl: '4000', amount: 62000, status: 'posted', anomaly: null },
    ];

    const spendCategories = [
        { name: 'Salaries', amount: '$1,387,000', percent: '45.8%', fill: '90%' },
        { name: 'Revenue', amount: '$1,593,100', percent: '44.5%', fill: '88%' },
        { name: 'Professional Services', amount: '$65,500', percent: '2.4%', fill: '5%' },
        { name: 'Taxes', amount: '$65,000', percent: '1.8%', fill: '4%' },
        { name: 'Marketing', amount: '$59,000', percent: '1.7%', fill: '3.5%' },
        { name: 'Transfers', amount: '$45,000', percent: '1.2%', fill: '2.5%' },
        { name: 'Software & SaaS', amount: '$43,500', percent: '1.1%', fill: '2%' },
        { name: 'Rent & Facilities', amount: '$24,000', percent: '0.7%', fill: '1%' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold font-outfit text-white">Transaction Ledger</h2>
                <p className="text-slate-500 text-sm mt-1">Full audit trail with AI categorization and anomaly scoring</p>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="premium-card p-6 flex items-center gap-4">
                    <div className="w-1 h-12 bg-emerald-500 rounded-full"></div>
                    <div>
                        <p className="text-2xl font-black text-white">$1,593,100</p>
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
                            <span className="text-emerald-500">↗</span> Total Credits
                        </p>
                    </div>
                </div>
                <div className="premium-card p-6 flex items-center gap-4">
                    <div className="w-1 h-12 bg-rose-500 rounded-full"></div>
                    <div>
                        <p className="text-2xl font-black text-white">$1,954,900</p>
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
                            <span className="text-rose-500">↘</span> Total Debits
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="text" className="w-full bg-slate-900 border border-slate-800 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block pl-10 p-2.5 text-white placeholder-slate-500" placeholder="Search transactions..." />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5 w-full md:w-40">
                        <option>All Types</option>
                        <option>Credit</option>
                        <option>Debit</option>
                    </select>
                    <select className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5 w-full md:w-40">
                        <option>All Categories</option>
                        <option>Salaries</option>
                        <option>Revenue</option>
                        <option>Professional Services</option>
                        <option>Taxes</option>
                        <option>Marketing</option>
                        <option>Transfers</option>
                        <option>Software & SaaS</option>
                        <option>Rent & Facilities</option>
                        <option>Equipment</option>
                        <option>Travel</option>
                        <option>Insurance</option>
                        <option>Meals & Entertainment</option>
                        <option>Utilities</option>
                        <option>Interest</option>
                        <option>Office Supplies</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="premium-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-400">
                        <thead className="text-[10px] text-slate-500 uppercase font-bold border-b border-slate-800 tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">DATE</th>
                                <th scope="col" className="px-6 py-4">DESCRIPTION</th>
                                <th scope="col" className="px-6 py-4">CATEGORY</th>
                                <th scope="col" className="px-6 py-4">GL CODE</th>
                                <th scope="col" className="px-6 py-4 text-right">AMOUNT</th>
                                <th scope="col" className="px-6 py-4 text-center">STATUS</th>
                                <th scope="col" className="px-6 py-4 text-center">ANOMALY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {transactions.map((tx, index) => (
                                <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 whitespace-nowrap">{tx.date}</td>
                                    <td className="px-6 py-3 font-semibold text-slate-200">{tx.description}</td>
                                    <td className="px-6 py-3">{tx.category}</td>
                                    <td className="px-6 py-3 text-slate-500">{tx.gl}</td>
                                    <td className={`px-6 py-3 text-right font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tx.status === 'posted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        {tx.anomaly ? (
                                            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                {tx.anomaly}
                                            </div>
                                        ) : (
                                            <div className="text-slate-600 text-center">—</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Spend by Category Footer */}
            <div className="premium-card p-6">
                <h3 className="text-sm font-bold font-outfit mb-4 text-white">Spend by Category</h3>
                <div className="space-y-3">
                    {spendCategories.map((cat, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                            <span className="w-40 text-slate-400 truncate">{cat.name}</span>
                            <div className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-sky-500 rounded-full" style={{ width: cat.fill }}></div>
                            </div>
                            <div className="w-32 flex justify-between font-medium">
                                <span className="text-slate-200">{cat.amount}</span>
                                <span className="text-slate-500">{cat.percent}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import { generateIncomeStatementPDF, generateIncomeStatementExcel } from '../services/exportService';

export const ReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pnl');
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState('2026');
    
    // Revenue vs Expenses by Category Data
    const categoryData = [
        { name: 'Software & S', value: 17 },
        { name: 'Salaries', value: 536 },
        { name: 'Meals & Ente', value: 5 },
        { name: 'Marketing', value: 27 },
        { name: 'Professional', value: 55 },
        { name: 'Utilities', value: 2 },
        { name: 'Transfers', value: 45 },
        { name: 'Equipment', value: 13 },
    ];

    const handleDownloadPDF = () => {
        setIsDownloadDropdownOpen(false);
        generateIncomeStatementPDF(selectedYear);
    };

    const handleDownloadExcel = () => {
        setIsDownloadDropdownOpen(false);
        generateIncomeStatementExcel(selectedYear);
    };

    const handleDownloadPPT = () => {
        setIsDownloadDropdownOpen(false);
        alert('PowerPoint presentation export is coming soon!');
    };

    const renderContent = () => {
        if (activeTab === 'balanceSheet') {
            return (
                <div className="premium-card h-96 flex items-center justify-center">
                    <p className="text-[var(--text-muted)] text-lg">Balance Sheet data placeholder. Connect your accounting software to view.</p>
                </div>
            );
        }
        if (activeTab === 'cashFlow') {
            return (
                <div className="premium-card h-96 flex items-center justify-center">
                    <p className="text-[var(--text-muted)] text-lg">Cash Flow Statement data placeholder. Sync your bank accounts to view.</p>
                </div>
            );
        }

        // P&L Content
        return (
            <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="premium-card py-4 px-6 border-l-4 border-l-emerald-500">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">TOTAL REVENUE</span>
                            <span className="text-emerald-500 text-xs font-bold">↗</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-500">$800K</p>
                    </div>
                    <div className="premium-card py-4 px-6 border-l-4 border-l-rose-500">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">TOTAL EXPENSES</span>
                            <span className="text-rose-500 text-xs font-bold">↘</span>
                        </div>
                        <p className="text-2xl font-bold text-rose-500">$768K</p>
                    </div>
                    <div className="premium-card py-4 px-6 border-l-4 border-l-emerald-500">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">NET INCOME</span>
                            <span className="text-emerald-500 text-xs font-bold">$</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-500">$32K</p>
                    </div>
                    <div className="premium-card py-4 px-6 border-l-4 border-l-[var(--color-primary)]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">NET MARGIN</span>
                            <span className="text-[var(--color-primary)] text-xs font-bold">📊</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-primary)]">4.0%</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="premium-card">
                    <h3 className="text-sm font-bold font-outfit mb-6">Revenue vs Expenses by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} interval={0} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} tickFormatter={(v) => `$${v}K`} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-main)'}} />
                                <Bar dataKey="value" fill="#f43f5e" radius={[2, 2, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Table */}
                <div className="premium-card overflow-x-auto">
                    <h3 className="text-sm font-bold font-outfit mb-4">Income Statement — {selectedYear}</h3>
                    <table className="w-full text-left text-sm">
                        <tbody className="divide-y divide-[var(--border-color)]">
                            <tr><td className="py-3 font-bold" colSpan={2}>REVENUE</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Revenue</td><td className="py-2 text-right">$798K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Interest</td><td className="py-2 text-right">$2K</td></tr>
                            <tr className="font-bold"><td className="py-3">Total Revenue</td><td className="py-3 text-right">$800K</td></tr>
                            
                            <tr><td className="py-3 font-bold mt-4" colSpan={2}>EXPENSES</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Software & SaaS</td><td className="py-2 text-right text-rose-500">-$17K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Salaries</td><td className="py-2 text-right text-rose-500">-$536K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Meals & Entertainment</td><td className="py-2 text-right text-rose-500">-$5K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Marketing</td><td className="py-2 text-right text-rose-500">-$27K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Professional Services</td><td className="py-2 text-right text-rose-500">-$55K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Utilities</td><td className="py-2 text-right text-rose-500">-$2K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Transfers</td><td className="py-2 text-right text-rose-500">-$45K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Equipment</td><td className="py-2 text-right text-rose-500">-$13K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Taxes</td><td className="py-2 text-right text-rose-500">-$35K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Rent & Facilities</td><td className="py-2 text-right text-rose-500">-$12K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Insurance</td><td className="py-2 text-right text-rose-500">-$10K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Travel</td><td className="py-2 text-right text-rose-500">-$10K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-2 pl-4">Office Supplies</td><td className="py-2 text-right text-rose-500">-$420</td></tr>
                            <tr className="font-bold"><td className="py-3">Total Expenses</td><td className="py-3 text-right text-rose-500">-$768K</td></tr>
                            
                            <tr className="font-bold border-t-2 border-[var(--border-color)]"><td className="py-4">EBITDA</td><td className="py-4 text-right">$32K</td></tr>
                            <tr className="font-bold"><td className="py-3">Net Income</td><td className="py-3 text-right">$32K</td></tr>
                            <tr className="text-[var(--text-muted)]"><td className="py-3 pl-4">Net Margin %</td><td className="py-3 text-right">4.0%</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black font-outfit">Financial Reports</h2>
                    <p className="text-[var(--text-muted)] mt-1">P&L, Balance Sheet, and Cash Flow — generated from live transaction data</p>
                </div>
                <div className="flex gap-2 relative">
                    <div>
                        <button onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)} className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[var(--bg-main)]">
                            FY {selectedYear} <span>▼</span>
                        </button>
                        {isYearDropdownOpen && (
                            <div className="absolute top-full mt-1 w-32 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg z-10 py-1">
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-main)]" onClick={() => {setSelectedYear('2025'); setIsYearDropdownOpen(false);}}>FY 2025</button>
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-main)]" onClick={() => {setSelectedYear('2024'); setIsYearDropdownOpen(false);}}>FY 2024</button>
                            </div>
                        )}
                    </div>
                    <div>
                        <button onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)} className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[var(--bg-main)]">
                            Download <span>▼</span>
                        </button>
                        {isDownloadDropdownOpen && (
                            <div className="absolute top-full mt-1 w-32 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg z-10 py-1">
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-main)]" onClick={handleDownloadPDF}>PDF</button>
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-main)]" onClick={handleDownloadExcel}>Excel</button>
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-main)]" onClick={handleDownloadPPT}>PowerPoint</button>
                            </div>
                        )}
                    </div>
                    <button className="btn-primary" onClick={handleDownloadPPT}>Create Presentation</button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-center gap-3 p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-600 dark:text-sky-400">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-sm font-medium">Download the full report as an <strong>Excel workbook</strong> (3 sheets), save as <strong>PDF</strong>, or generate a polished <strong>PowerPoint presentation</strong> with 6 branded slides ready to share.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--border-color)]">
                <nav className="flex space-x-8">
                    <button onClick={() => setActiveTab('pnl')} className={`pb-4 text-sm font-bold transition-colors ${activeTab === 'pnl' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                        📈 P&L Statement
                    </button>
                    <button onClick={() => setActiveTab('balanceSheet')} className={`pb-4 text-sm font-bold transition-colors ${activeTab === 'balanceSheet' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                        ⚖️ Balance Sheet
                    </button>
                    <button onClick={() => setActiveTab('cashFlow')} className={`pb-4 text-sm font-bold transition-colors ${activeTab === 'cashFlow' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                        💵 Cash Flow
                    </button>
                </nav>
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
};

export const WorkflowsPage: React.FC = () => {
    const dataContext = useContext(DataContext) as DataContextType;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="premium-card space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-white font-outfit font-bold">Accounts Payable</h2>
                <p className="text-slate-400 mb-6">Review and approve upcoming bills.</p>
                <div className="space-y-4">
                    {dataContext.apBills.map((bill, index) => (
                        <div key={index} className="p-4 border dark:border-slate-700 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{bill.vendor}</p>
                                <p className="text-sm text-slate-400">Due: {bill.due}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-rose-600">${bill.amount.toFixed(2)}</p>
                                <button className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full mt-1 hover:bg-emerald-600">Approve</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="premium-card space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-white font-outfit font-bold">Accounts Receivable</h2>
                <p className="text-slate-400 mb-6">Track outstanding invoices.</p>
                <div className="space-y-4">
                    {dataContext.arInvoices.map((invoice, index) => (
                        <div key={index} className="p-4 border dark:border-slate-700 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{invoice.customer}</p>
                                <p className="text-sm text-slate-400">{invoice.due}</p>
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
    <div className="premium-card space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-white font-outfit font-bold">Budget vs. Actuals</h2>
        <p className="text-slate-400 mb-6">Track your spending against your budget in real-time. FiNet flags categories that are over budget.</p>
        <div className="space-y-6">
            <div><div className="flex justify-between mb-1"><span className="text-base font-medium text-slate-200 font-semibold">Marketing</span><span className="text-sm font-medium text-slate-200 font-semibold">$10,500 / $10,000 <span className="text-rose-500 font-bold">(105%)</span></span></div><div className="w-full bg-slate-800 rounded-full h-4"><div className="bg-rose-500 h-4 rounded-full" style={{ width: '100%' }}></div></div></div>
            <div><div className="flex justify-between mb-1"><span className="text-base font-medium text-slate-200 font-semibold">Software & Subscriptions</span><span className="text-sm font-medium text-slate-200 font-semibold">$1,800 / $2,000 (90%)</span></div><div className="w-full bg-slate-800 rounded-full h-4"><div className="bg-amber-500 h-4 rounded-full" style={{ width: '90%' }}></div></div></div>
            <div><div className="flex justify-between mb-1"><span className="text-base font-medium text-slate-200 font-semibold">Cloud & Hosting</span><span className="text-sm font-medium text-slate-200 font-semibold">$600 / $1,000 (60%)</span></div><div className="w-full bg-slate-800 rounded-full h-4"><div className="bg-emerald-500 h-4 rounded-full" style={{ width: '60%' }}></div></div></div>
        </div>
    </div>
);

export const IntegrationsPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-white font-outfit font-bold">Seamless Integrations</h2>
        <p className="text-slate-400 mb-6">Connect your favorite business tools to create a single source of truth for your financial data.</p>
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
            <div><h2 className="text-xl font-semibold text-white font-outfit font-bold">Settings</h2><p className="text-slate-400 mt-1">Customize your FiNet workspace.</p></div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Appearance</h3>
                <div className="mt-4 flex items-center space-x-4">
                    <span className="text-slate-400">Light</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-[var(--color-primary-hover)] rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                    <span className="text-slate-400">Dark</span>
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
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-200">Subscription & Billing</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Manage your FiNet Pro plan and trial status.</p>
                
                <div className="mt-6 p-6 rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-light)]">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="px-2 py-1 bg-[var(--color-primary)] text-white text-[10px] font-black rounded-lg uppercase tracking-wider">Active Trial</span>
                            <h4 className="text-xl font-bold mt-2">FiNet Enterprise Pro</h4>
                            <p className="text-sm text-[var(--text-muted)]">30-day free trial ends in 24 days.</p>
                        </div>
                        <button className="btn-primary">Upgrade to Annual</button>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Next Billing</p>
                            <p className="text-sm font-bold">$199.00 on Jun 1, 2026</p>
                        </div>
                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Payment Method</p>
                            <p className="text-sm font-bold">•••• 4242</p>
                        </div>
                    </div>
                </div>
            </div>
            
             <div className="border-t border-slate-200 dark:border-slate-700 pt-6"><h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Multi-Currency</h3><p className="text-sm text-slate-400 mt-1">Manage finances across different currencies.</p><div className="mt-4 space-y-4"><label className="block"><span className="text-slate-200 font-semibold">Base Currency</span><select className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"><option>USD - United States Dollar</option><option>EUR - Euro</option><option>GBP - British Pound</option></select></label></div></div>
        </div>
    );
};


// The following are simple placeholder pages.
export const ExpenseManagementPage: React.FC = () => (
    <div className="premium-card space-y-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-white font-outfit font-bold">Expense Reports</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">Submit New Report</button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-400"><thead className="text-xs text-slate-200 font-semibold uppercase bg-slate-50 dark:bg-slate-700"><tr><th scope="col" className="px-6 py-3">Report ID</th><th scope="col" className="px-6 py-3">Submitted By</th><th scope="col" className="px-6 py-3">Amount</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3 text-center">Action</th></tr></thead><tbody>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">ER-2025-003</td><td className="px-6 py-4">Alice Johnson</td><td className="px-6 py-4">$450.50</td><td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Approved</span></td><td className="px-6 py-4 text-center"><a href="#" className="font-medium text-[var(--color-primary)] hover:underline">View</a></td>
        </tr>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">ER-2025-002</td><td className="px-6 py-4">Bob Williams</td><td className="px-6 py-4">$1,200.00</td><td className="px-6 py-4"><span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Pending Approval</span></td><td className="px-6 py-4 text-center"><a href="#" className="font-medium text-[var(--color-primary)] hover:underline">Review</a></td>
        </tr>
    </tbody></table></div></div>
);

export const InventoryPage: React.FC = () => (
    <div className="premium-card space-y-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-white font-outfit font-bold">Inventory Management</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">Add New Item</button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-400"><thead className="text-xs text-slate-200 font-semibold uppercase bg-slate-50 dark:bg-slate-700"><tr><th scope="col" className="px-6 py-3">Item Name</th><th scope="col" className="px-6 py-3">SKU</th><th scope="col" className="px-6 py-3">Stock Level</th><th scope="col" className="px-6 py-3">Reorder Point</th><th scope="col" className="px-6 py-3">Value</th></tr></thead><tbody>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">Pro Widget</td><td className="px-6 py-4">PW-001</td><td className="px-6 py-4 font-semibold">150 units</td><td className="px-6 py-4">100</td><td className="px-6 py-4">$7,500.00</td>
        </tr>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">Standard Gizmo</td><td className="px-6 py-4">SG-002</td><td className="px-6 py-4 font-semibold text-rose-500 flex items-center"><span className="w-2 h-2 mr-2 bg-rose-500 rounded-full"></span>45 units</td><td className="px-6 py-4">50</td><td className="px-6 py-4">$1,125.00</td>
        </tr>
    </tbody></table></div></div>
);

export const ProjectsPage: React.FC = () => (
    <div><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-white font-outfit font-bold">Project-Based Accounting</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">New Project</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="premium-card space-y-4"><h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Website Redesign</h3><p className="text-sm text-slate-400 mb-4">ClientCorp</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Budget:</span><span className="font-semibold">$20,000</span></div><div className="flex justify-between"><span>Invoiced:</span><span className="font-semibold">$15,000</span></div><div className="flex justify-between pt-2 border-t dark:border-slate-700"><span>Profitability:</span><span className="font-bold text-emerald-500">45%</span></div></div></div>
        <div className="premium-card space-y-4"><h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Q3 Marketing Campaign</h3><p className="text-sm text-slate-400 mb-4">Global Solutions Ltd.</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Budget:</span><span className="font-semibold">$50,000</span></div><div className="flex justify-between"><span>Invoiced:</span><span className="font-semibold">$50,000</span></div><div className="flex justify-between pt-2 border-t dark:border-slate-700"><span>Profitability:</span><span className="font-bold text-rose-500">-5%</span></div></div></div>
    </div></div>
);

export const FixedAssetsPage: React.FC = () => (
    <div className="premium-card space-y-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold text-white font-outfit font-bold">Fixed Asset Register</h2><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-primary-hover)] transition text-sm font-semibold">Add New Asset</button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-slate-400"><thead className="text-xs text-slate-200 font-semibold uppercase bg-slate-50 dark:bg-slate-700"><tr><th scope="col" className="px-6 py-3">Asset</th><th scope="col" className="px-6 py-3">Acquisition Date</th><th scope="col" className="px-6 py-3">Cost</th><th scope="col" className="px-6 py-3">Depreciation</th><th scope="col" className="px-6 py-3">Book Value</th></tr></thead><tbody>
        <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">MacBook Pro 16"</td><td className="px-6 py-4">2024-01-15</td><td className="px-6 py-4">$2,500.00</td><td className="px-6 py-4">($416.67)</td><td className="px-6 py-4 font-semibold">$2,083.33</td>
        </tr>
    </tbody></table></div></div>
);

export const TaxCenterPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto"><h2 className="text-xl font-semibold mb-2 text-white font-outfit font-bold">Tax Center</h2><p className="text-slate-400 mb-6">Stay on top of your tax obligations with AI-powered estimates and reports.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg text-center"><h3 className="text-slate-400 font-medium">Estimated Q3 Tax Due</h3><p className="text-4xl font-bold text-[var(--color-primary)] mt-2">$8,540.00</p><p className="text-xs text-slate-400 mt-1">Due: Sep 15, 2025</p></div>
        <div className="p-6 flex flex-col justify-center"><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Tax-Ready Reports</h3><div className="space-y-2"><button className="w-full text-left bg-slate-100 dark:bg-slate-700 p-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition">Generate P&L for Tax</button><button className="w-full text-left bg-slate-100 dark:bg-slate-700 p-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition">Export Expense Report</button></div></div>
    </div></div>
);

export const PayrollPage: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-4xl mx-auto"><div className="text-center"><h2 className="text-xl font-semibold mb-2 text-white font-outfit font-bold">Run Payroll</h2><p className="text-slate-400 mb-6">Process payroll in minutes with our fully integrated system.</p></div><div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg mb-6"><div className="flex justify-between items-center"><h3 className="font-medium text-slate-600 dark:text-slate-300">Next Pay Run: <span className="font-bold text-slate-800 dark:text-slate-100">Jul 1 - Jul 15</span></h3><p className="text-slate-600 dark:text-slate-300">Pay Date: <span className="font-bold text-slate-800 dark:text-slate-100">Jul 20, 2025</span></p></div></div><div className="text-center"><p className="text-slate-400">Total Payroll Cost</p><p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 my-2">$45,820.50</p><button className="w-full max-w-xs mx-auto bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-emerald-700 transition duration-300 text-lg">Run Payroll</button></div></div>
);

export const ReconciliationPage: React.FC = () => {
    const [matches, setMatches] = useState([
        { id: 1, bank: "Stripe Payout - #8392", ledger: "Sales Revenue - Jun 15", amount: 12500.00, confidence: 99, status: 'pending' },
        { id: 2, bank: "Google Cloud", ledger: "Hosting Expenses", amount: 420.55, confidence: 95, status: 'pending' },
        { id: 3, bank: "Office Depot", ledger: "Unknown Expense", amount: 85.20, confidence: 72, status: 'pending' },
    ]);

    const handleConfirm = (id: number) => {
        setMatches(prev => prev.map(m => m.id === id ? { ...m, status: 'confirmed' } : m));
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit">AI Auto-Reconciliation</h2>
                    <p className="text-[var(--text-muted)] mt-1">FiNet has automatically matched 142/145 bank transactions.</p>
                </div>
                <button className="btn-primary">Sync with Bank</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card border-b-4 border-emerald-500">
                    <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Matched Status</p>
                    <h3 className="text-3xl font-black font-outfit text-emerald-600 mt-2">98.2%</h3>
                    <p className="text-[10px] text-emerald-500 mt-1 font-bold">+1.5% from yesterday</p>
                </div>
                <div className="premium-card border-b-4 border-rose-500">
                    <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Unreconciled</p>
                    <h3 className="text-3xl font-black font-outfit text-rose-600 mt-2">12 Items</h3>
                    <p className="text-[10px] text-rose-400 mt-1 font-bold">Requires manual review</p>
                </div>
                <div className="premium-card border-b-4 border-sky-500">
                    <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">AI Suggestions</p>
                    <h3 className="text-3xl font-black font-outfit text-sky-600 mt-2">8 High Conf.</h3>
                    <p className="text-[10px] text-sky-400 mt-1 font-bold">Ready for approval</p>
                </div>
            </div>

            <div className="premium-card">
                <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 w-fit">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Continuous Close Active</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Bank Entry</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Suggested Ledger</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Amount</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Confidence</th>
                                <th className="pb-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {matches.map(match => (
                                <tr key={match.id} className="group hover:bg-[var(--bg-main)] transition-colors">
                                    <td className="py-6">
                                        <p className="text-sm font-bold">{match.bank}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-medium">Bank Reference: TRX-9921</p>
                                    </td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                                            <p className="text-sm font-bold">{match.ledger}</p>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <p className="text-sm font-black">${match.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${match.confidence}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600">{match.confidence}%</span>
                                        </div>
                                    </td>
                                    <td className="py-6 text-right">
                                        {match.status === 'confirmed' ? (
                                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">Matched</span>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-[var(--text-muted)] hover:text-rose-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                                <button onClick={() => handleConfirm(match.id)} className="px-4 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all">Confirm Match</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const RiskDiscoveryPage: React.FC = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiInsights, setAiInsights] = useState<string | null>(null);
    const dataContext = useContext(DataContext) as DataContextType;

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const insights = await geminiService.getRiskInsights(dataContext.transactions);
            setAiInsights(insights);
        } catch (err) {
            setAiInsights("Failed to generate strategic insights. Ensure your transactions are loaded.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit">Risk & Audit Discovery</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-widest font-bold">Continuous Monitoring Active</p>
                </div>
                <button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="btn-primary flex items-center gap-2"
                >
                    {isAnalyzing ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Running AI Audit...</>
                    ) : (
                        <>Run AI Risk Audit</>
                    )}
                </button>
            </div>

            {aiInsights ? (
                <div className="premium-card bg-slate-900 text-slate-200 border-l-4 border-l-sky-500 prose prose-invert max-w-none">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">Verified Strategic Intelligence</span>
                    </div>
                    <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: aiInsights.replace(/\n/g, '<br/>') }}></div>
                </div>
            ) : (
                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-6 rounded-2xl flex items-start">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mr-4 shrink-0">
                        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-100">3 Priority Anomalies Flagged</h3>
                        <p className="text-rose-700 dark:text-rose-400 text-sm mt-1">Our continuous monitoring has identified deviations in the Accounts Payable cycle. Run a full audit for details.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="premium-card">
                    <h3 className="font-bold font-outfit mb-6">Real-time Risk Vectors</h3>
                    <div className="space-y-6">
                        <RiskMetric label="Duplicate Invoice Probability" score={15} color="bg-emerald-500" />
                        <RiskMetric label="Unauthorized Vendor Activity" score={42} color="bg-amber-500" />
                        <RiskMetric label="Benford's Law Deviation" score={78} color="bg-rose-500" />
                        <RiskMetric label="Regulatory Compliance Gap" score={22} color="bg-emerald-500" />
                    </div>
                </div>

                <div className="premium-card bg-gradient-to-br from-[var(--bg-card)] to-[var(--color-primary-light)]">
                    <h3 className="font-bold font-outfit mb-6">Audit Defense Readiness</h3>
                    <div className="flex items-center gap-10">
                        <div className="w-32 h-32 relative">
                            <svg className="w-full h-full transform -rotate-90 shadow-2xl rounded-full">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[var(--border-color)]" />
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={364} strokeDashoffset={364 * 0.15} className="text-[var(--color-primary)] transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-3xl font-black font-outfit">85%</span>
                                <span className="text-[8px] uppercase font-bold text-[var(--text-muted)]">Reliability</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <p className="text-xs font-semibold">12/12 Workpapers Verified</p>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <p className="text-xs font-semibold italic">Sample Testing In-Progress</p>
                            </div>
                            <button className="w-full mt-2 py-3 bg-white text-[var(--text-main)] border border-[var(--border-color)] rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[var(--bg-main)] transition-colors">
                                Prepare Board-Ready File
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RiskMetric: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
    <div>
        <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
            <span>{label}</span>
            <span>{score}%</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }}></div>
        </div>
    </div>
);

export const ScenarioPlanningPage: React.FC = () => {
    const [revenueGrowth, setRevenueGrowth] = useState(15);
    const [opexReduction, setOpexReduction] = useState(5);
    const [hiringCount, setHiringCount] = useState(2);

    const generateProjection = () => {
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let currentCash = 125000;
        return months.map((month, i) => {
            const growthFactor = 1 + (revenueGrowth / 100);
            const savingsFactor = 1 - (opexReduction / 100);
            const hiringCost = hiringCount * 8000; // $8k per new hire
            
            // Simple projection logic
            const revenue = 80000 * Math.pow(growthFactor, i/12);
            const expenses = (60000 * savingsFactor) + hiringCost;
            currentCash += (revenue - expenses);
            
            return {
                name: month,
                "Projected Cash": Math.round(currentCash),
                "Burn Rate": Math.round(expenses)
            };
        });
    };

    const projectionData = generateProjection();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black font-outfit">What-If Scenario Modeling</h2>
                    <p className="text-[var(--text-muted)] mt-1">Simulate strategic shifts and their impact on your 6-month runway.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-xs font-bold hover:bg-[var(--bg-main)] transition-colors">Reset Baseline</button>
                    <button className="btn-primary">Save Scenario A</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="premium-card space-y-8">
                    <h3 className="font-bold font-outfit border-b border-[var(--border-color)] pb-4">Variable Drivers</h3>
                    
                    <SimulationSlider 
                        label="Revenue Growth (Annual %)" 
                        value={revenueGrowth} 
                        min={-20} 
                        max={100} 
                        onChange={setRevenueGrowth} 
                        suffix="%"
                    />
                    
                    <SimulationSlider 
                        label="OPEX Reduction (%)" 
                        value={opexReduction} 
                        min={0} 
                        max={30} 
                        onChange={setOpexReduction} 
                        suffix="%"
                    />

                    <SimulationSlider 
                        label="New Strategic Hires" 
                        value={hiringCount} 
                        min={0} 
                        max={20} 
                        onChange={setHiringCount} 
                        suffix=" FTEs"
                    />

                    <div className="p-4 bg-[var(--color-primary-light)] rounded-2xl border border-[var(--color-primary)]">
                        <p className="text-[10px] font-black uppercase text-[var(--color-primary)] mb-1">Projected Runway</p>
                        <p className="text-2xl font-black">{Math.floor(projectionData[5]["Projected Cash"] / projectionData[5]["Burn Rate"])} Months</p>
                    </div>
                </div>

                <div className="lg:col-span-2 premium-card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold font-outfit">Projected Cash Balance</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div><span className="text-[10px] font-bold text-[var(--text-muted)]">CASH</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-[10px] font-bold text-[var(--text-muted)]">BURN</span></div>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={projectionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} tickFormatter={(v) => `$${v/1000}k`} />
                                <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
                                <Line type="monotone" dataKey="Projected Cash" stroke="var(--color-primary)" strokeWidth={4} dot={{r: 6}} activeDot={{r: 8}} />
                                <Line type="monotone" dataKey="Burn Rate" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SimulationSlider: React.FC<{ label: string; value: number; min: number; max: number; onChange: (v: number) => void; suffix: string }> = ({ label, value, min, max, onChange, suffix }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
            <span className="text-sm font-black font-outfit text-[var(--color-primary)]">{value}{suffix}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[var(--border-color)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
        />
    </div>
);

export const ESGReportingPage: React.FC = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit">Sustainability & Impact (ESG)</h2>
                    <p className="text-[var(--text-muted)] mt-1 uppercase tracking-widest font-bold text-[10px]">Real-time Carbon Tracking Active</p>
                </div>
                <button className="btn-primary">Generate Workiva-Style Report</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <EsgCard 
                    label="Environmental (E)" 
                    value="12.5 tCO2e" 
                    trend="-12%" 
                    color="text-emerald-500" 
                    metric="Net Carbon Footprint"
                    icon="🌱"
                />
                <EsgCard 
                    label="Social (S)" 
                    value="42%" 
                    trend="+4%" 
                    color="text-sky-500" 
                    metric="Diversity & Inclusion Ratio"
                    icon="🤝"
                />
                <EsgCard 
                    label="Governance (G)" 
                    value="88/100" 
                    trend="A+" 
                    color="text-amber-500" 
                    metric="Internal Control Score"
                    icon="⚖️"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="premium-card">
                    <h3 className="font-bold font-outfit mb-6">Carbon Intensity by Department</h3>
                    <div className="space-y-4">
                        <DepartmentImpact label="Manufacturing" percentage={65} />
                        <DepartmentImpact label="Logistics" percentage={45} />
                        <DepartmentImpact label="Headquarters" percentage={12} />
                        <DepartmentImpact label="Data Centers" percentage={28} />
                    </div>
                </div>

                <div className="premium-card flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold font-outfit mb-4">Regulatory Compliance Tracker</h3>
                        <div className="space-y-3">
                            <ComplianceRow label="SFDR Disclosure" status="Compliant" />
                            <ComplianceRow label="UK Modern Slavery Act" status="Review Needed" isWarning />
                            <ComplianceRow label="SOC2 Type II" status="Active" />
                            <ComplianceRow label="GDPR Audit" status="Compliant" />
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-white">
                        <p className="text-[10px] font-black uppercase text-slate-500 mb-2">AI Compliance Note</p>
                        <p className="text-xs leading-relaxed text-slate-300">New EU sustainability directives (CSRD) take effect in 120 days. Your current data collection covers 85% of requirements.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EsgCard: React.FC<{ label: string; value: string; trend: string; color: string; metric: string; icon: string }> = ({ label, value, trend, color, metric, icon }) => (
    <div className="premium-card relative overflow-hidden group hover:scale-[1.02] transition-transform">
        <div className="absolute top-0 right-0 p-6 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">{icon}</div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">{label}</p>
        <p className={`text-3xl font-black font-outfit mb-1 ${color}`}>{value}</p>
        <div className="flex justify-between items-end mt-4">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">{metric}</span>
            <span className={`text-[10px] font-black ${trend.startsWith('-') || trend === 'A+' ? 'text-emerald-500' : 'text-sky-500'}`}>{trend}</span>
        </div>
    </div>
);

const DepartmentImpact: React.FC<{ label: string; percentage: number }> = ({ label, percentage }) => (
    <div>
        <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
            <span>{label}</span>
            <span>{percentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const ComplianceRow: React.FC<{ label: string; status: string; isWarning?: boolean }> = ({ label, status, isWarning }) => (
    <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)]">
        <span className="text-xs font-bold">{label}</span>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isWarning ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{status}</span>
    </div>
);

export const MarketIntelligencePage: React.FC = () => {
    const marketInsights = [
      { id: 1, type: 'Alert', title: 'Inflation Spike', description: 'Headline inflation rose to 4.2%. Projecting 12% increase in cloud hosting costs next quarter.', urgency: 'High' },
      { id: 2, type: 'Opportunity', title: 'Currency Fluctuation', description: 'USD/EUR rate is favorable for EU service expansion. Now is a strategic time for relocation of Euro-denominated debt.', urgency: 'Med' },
      { id: 3, type: 'Competitor', title: 'New Product Launch', description: 'Main competitor "FinFlow" launched a new payroll module. Customer sentiment indicates high interest in automated tax filing.', urgency: 'Low' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit">Global Market Intelligence</h2>
                    <p className="text-[var(--text-muted)] mt-1 uppercase tracking-widest font-bold text-[10px]">AlphaSense-Style Synthesis Active</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-xs font-bold hover:bg-[var(--bg-main)] transition-colors">Source Config</button>
                    <button className="btn-primary">Generate Analyst Briefing</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card">
                        <h3 className="font-bold font-outfit mb-6">Strategic News Synthesis</h3>
                        <div className="space-y-6">
                            {marketInsights.map(insight => (
                                <div key={insight.id} className="p-5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] group hover:border-[var(--color-primary)] transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${insight.urgency === 'High' ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white'}`}>
                                                {insight.type}
                                            </span>
                                            <span className="text-[10px] font-bold text-[var(--text-muted)]">Source: Financial Times • 2h ago</span>
                                        </div>
                                        <button className="text-[var(--text-muted)] hover:text-[var(--color-primary)]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg></button>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2">{insight.title}</h4>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{insight.description}</p>
                                    <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center gap-4">
                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Bullish Impact</span>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] underline cursor-pointer">Read Full Synthesis</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="premium-card">
                        <h3 className="font-bold font-outfit mb-6">Market Sentiment Heatmap</h3>
                        <div className="space-y-5">
                            <SentimentIndex label="Small Business Confidence" score={62} status="Bullish" color="text-emerald-500" />
                            <SentimentIndex label="SaaS Sector Multiple" score={48} status="Neutral" color="text-amber-500" />
                            <SentimentIndex label="Central Bank Stance" score={25} status="Hawkish" color="text-rose-500" />
                        </div>
                    </div>

                    <div className="premium-card bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-2xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4">Competitor Edge</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-white/5 rounded-xl">
                                <p className="text-[10px] font-bold text-indigo-300 mb-1">FinFlow (Tier 1)</p>
                                <p className="text-xs">Launched automated VAT filing. Current user sentiment is mixed due to latency.</p>
                            </div>
                            <button className="w-full py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-400 transition-colors">
                                View Full Intelligence Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SentimentIndex: React.FC<{ label: string; score: number; status: string; color: string }> = ({ label, score, status, color }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">{label}</span>
            <span className={`text-[10px] font-black ${color}`}>{status}</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" style={{ width: '100%', position: 'relative' }}>
                <div className="absolute top-0 w-1 h-full bg-white shadow-xl" style={{ left: `${score}%` }}></div>
            </div>
        </div>
    </div>
);

export const ExecutiveInsightsPage: React.FC = () => {
    const ssaData = [
        { name: 'Jan', MRR: 45000, Churn: 2.1 },
        { name: 'Feb', MRR: 48000, Churn: 1.9 },
        { name: 'Mar', MRR: 52000, Churn: 2.3 },
        { name: 'Apr', MRR: 58000, Churn: 1.5 },
        { name: 'May', MRR: 65000, Churn: 1.2 },
        { name: 'Jun', MRR: 72000, Churn: 1.0 },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <MetricCard 
                    title="Customer Lifetime Value (LTV)" 
                    value="$12,450" 
                    trend="+15%" 
                    description="Avg. revenue per customer over 3 years"
                />
                <MetricCard 
                    title="Acquisition Cost (CAC)" 
                    value="$840" 
                    trend="-8%" 
                    description="Fully-loaded marketing & sales cost"
                />
                <MetricCard 
                    title="LTV:CAC Ratio" 
                    value="14.8x" 
                    trend="Optimal" 
                    description="Health of business unit economics"
                    isSpecial
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="premium-card">
                    <h3 className="text-lg font-bold font-outfit mb-6">Revenue Growth (MRR)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ssaData}>
                                <defs>
                                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} tickFormatter={(v) => `$${v/1000}k`} />
                                <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
                                <Area type="monotone" dataKey="MRR" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="premium-card">
                    <h3 className="text-lg font-bold font-outfit mb-6">Monthly Churn Analysis</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ssaData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} tickFormatter={(v) => `${v}%`} />
                                <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
                                <Bar dataKey="Churn" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="premium-card bg-slate-900 text-white">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">💡</div>
                    <div>
                        <h3 className="text-xl font-bold font-outfit">AI Strategic Recommendation</h3>
                        <p className="text-slate-400 text-sm">Based on LTV:CAC and Current Runway</p>
                    </div>
                </div>
                <p className="text-slate-300 leading-relaxed max-w-3xl">
                    Your LTV:CAC ratio of **14.8x** is significantly above the industry benchmark (3.0x). 
                    This indicates an extremely efficient acquisition model. **Recommendation:** Aggressively scale marketing 
                    spend by 25-30% in Q3. Current runway of 14 months allows for this expansion while maintaining 
                    a 10-month safety buffer.
                </p>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string; trend: string; description: string; isSpecial?: boolean }> = ({ title, value, trend, description, isSpecial }) => (
    <div className={`premium-card ${isSpecial ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary-light)]' : ''}`}>
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{title}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : trend === 'Optimal' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
                {trend}
            </span>
        </div>
        <p className="text-4xl font-black font-outfit mb-2">{value}</p>
        <p className="text-xs text-[var(--text-muted)] leading-tight">{description}</p>
    </div>
);