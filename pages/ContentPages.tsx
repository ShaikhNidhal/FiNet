import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeContext, DataContext } from '../App';
import { ThemeContextType, DataContextType, ThemeName, Transaction, UserRole, TeamMember, ExpenseReport } from '../types';
import { THEMES } from '../constants';
import { geminiService } from '../services/geminiService';
import { mailService } from '../services/mailService';
import { convertCurrency, SUPPORTED_CURRENCIES } from '../utils/currencyUtils';


const NewKpiCard: React.FC<{ title: string; value: string; subtext: string; isPositive: boolean; icon: React.ReactNode }> = ({ title, value, subtext, isPositive, icon }) => (
    <div className="premium-card relative overflow-hidden flex flex-col justify-between p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{title}</h3>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center text-sky-500 shadow-sm">
                {icon}
            </div>
        </div>
        <div>
            <p className="text-3xl font-black text-[var(--text-main)] mb-1">{value}</p>
            <p className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : (subtext.includes('per month') ? 'text-[var(--text-muted)]' : 'text-rose-500')}`}>
                {subtext}
            </p>
        </div>
    </div>
);

export const DashboardPage: React.FC = () => {
    const { transactions } = useContext(DataContext) as DataContextType;

    // Dynamic Calculations
    const cashPosition = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    const totalRevenue = transactions.reduce((acc, tx) => tx.amount > 0 ? acc + tx.amount : acc, 0);
    const monthlyBurn = Math.abs(transactions
        .filter(tx => tx.amount < 0 && tx.date.startsWith(new Date().toISOString().slice(0, 7)))
        .reduce((acc, tx) => acc + tx.amount, 0));
    
    // Fallback for monthly burn if no transactions this month
    const avgMonthlyBurn = Math.abs(transactions
        .filter(tx => tx.amount < 0)
        .reduce((acc, tx) => acc + tx.amount, 0)) / (transactions.length > 0 ? 12 : 1);

    const openAnomaliesCount = transactions.filter(tx => tx.anomaly).length;
    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    // Dynamic Cash Flow Data (simplified for demo)
    const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - i));
        return d.toISOString().slice(0, 7);
    });

    const cashFlowData = months.map(m => {
        const monthTx = transactions.filter(tx => tx.date.startsWith(m));
        return {
            name: m,
            Inflow: monthTx.filter(tx => tx.amount > 0).reduce((acc, tx) => acc + tx.amount, 0),
            Outflow: Math.abs(monthTx.filter(tx => tx.amount < 0).reduce((acc, tx) => acc + tx.amount, 0))
        };
    });

    return (
        <div className="animate-in fade-in duration-700">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column - Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-xl font-bold font-outfit text-[var(--text-main)]">Financial Dashboard</h2>
                        <p className="text-[var(--text-muted)] text-sm mt-1">Real-time overview of your financial position</p>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <NewKpiCard 
                            title="CASH POSITION" 
                            value={`$${(cashPosition / 1000).toFixed(1)}K`} 
                            subtext="Live Treasury Balance" 
                            isPositive={cashPosition > 0} 
                            icon={<span className="font-bold text-sm">$</span>} 
                        />
                        <NewKpiCard 
                            title="TOTAL REVENUE" 
                            value={`$${(totalRevenue / 1000000).toFixed(2)}M`} 
                            subtext="↗ YTD" 
                            isPositive={true} 
                            icon={<span className="font-bold text-sm">↗</span>} 
                        />
                        <NewKpiCard 
                            title="AVG BURN RATE" 
                            value={`$${((monthlyBurn || avgMonthlyBurn) / 1000).toFixed(1)}K`} 
                            subtext="per month" 
                            isPositive={false} 
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>} 
                        />
                        <NewKpiCard 
                            title="DAYS OUTSTANDING" 
                            value="6d" 
                            subtext="avg receivables" 
                            isPositive={true} 
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
                        />
                    </div>

                    {/* Alert Banner */}
                    {openAnomaliesCount > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-rose-950/20 border border-rose-900/50 rounded-lg text-rose-500">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <p className="text-sm font-semibold">{openAnomaliesCount} anomalies require attention</p>
                        </div>
                    )}

                    {/* Area Chart */}
                    <div className="premium-card">
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
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }} 
                                        axisLine={false}
                                        tickLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis 
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }} 
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `$${value/1000}K`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'var(--bg-card)', 
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--text-main)',
                                            fontSize: '12px'
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold font-outfit text-[var(--text-main)]">Recent Transactions</h3>
                            <button className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:text-sky-400">View All</button>
                        </div>
                        <div className="space-y-4">
                            {recentTransactions.map((tx, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-[var(--border-color)] last:border-0">
                                    <div>
                                        <p className="font-semibold text-[var(--text-main)] text-sm">{tx.description}</p>
                                        <p className="text-[11px] text-[var(--text-muted)] mt-1">{tx.category} • {tx.date}</p>
                                    </div>
                                    <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-emerald-500' : 'text-[var(--text-main)]'}`}>
                                        {tx.amount > 0 ? '+' : ''}${tx.amount.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="xl:col-span-1 space-y-6 xl:pt-[4.5rem]">
                    {/* AI Strategic Insights */}
                    <div className="premium-card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold font-outfit text-[var(--text-main)]">AI Strategic Insights</h3>
                            <span className="px-2 py-1 bg-sky-500/10 text-sky-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Live</span>
                        </div>
                        <div className="space-y-6">
                            <div className="group cursor-default">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">↑</div>
                                    <h4 className="font-semibold text-[var(--text-main)] text-sm">Revenue Acceleration</h4>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-11">Month-over-month growth is exceeding projections by 15%. Recommend increasing marketing spend in Region A.</p>
                            </div>
                            <div className="group cursor-default">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold">!</div>
                                    <h4 className="font-semibold text-[var(--text-main)] text-sm">Subscription Bloat</h4>
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
                                <p className="text-xl font-bold text-[var(--text-main)] leading-tight">10</p>
                                <p className="text-xs text-[var(--text-muted)]">Open Invoices</p>
                            </div>
                        </div>
                        <div className="premium-card flex items-center gap-4 p-4">
                            <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[var(--text-main)] leading-tight">{openAnomaliesCount}</p>
                                <p className="text-xs text-[var(--text-muted)]">Open Anomalies</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const DetailField: React.FC<{ label: string; value: string; isBold?: boolean }> = ({ label, value, isBold }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{label}</p>
        <p className={`text-xs text-white ${isBold ? 'font-black' : 'font-medium'}`}>{value}</p>
    </div>
);

export const DataExtractionPage: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
    const [docType, setDocType] = useState('Invoice');
    const [pastedText, setPastedText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [learnedRules, setLearnedRules] = useState<Record<string, string>>({});
    const [isRefining, setIsRefining] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { baseCurrency, setBaseCurrency, setTransactions } = useContext(DataContext) as DataContextType;
    const navigate = useNavigate();

    const handleFileClick = () => {
        if (activeInputTab === 'upload') {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setExtractedData(null);
            setError(null);
        }
    };

    const handleExtract = async () => {
        if (activeInputTab === 'upload' && !selectedFile) {
            setError("Please select a file first.");
            return;
        }
        if (activeInputTab === 'paste' && !pastedText.trim()) {
            setError("Please paste some text first.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setExtractedData(null);
        
        const rulesString = Object.entries(learnedRules).map(([v, c]) => `Rule: For vendor '${v}', always use category '${c}'.`).join(' ');
        const mockDocText = activeInputTab === 'paste' 
            ? pastedText 
            : `Analysis requested for document type: ${docType}. Filename: ${selectedFile?.name}. User Preferences: ${rulesString}`;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const data = await geminiService.analyzeDocument(mockDocText);
            
            if (data) {
                const amount = parseFloat(data["Total Amount"] || data.amount || "0.00");
                const currency = data.Currency || data.currency || "USD";
                
                // Live conversion
                const converted = convertCurrency(amount, currency, baseCurrency);

                const result = {
                    vendor: data["Vendor/Customer Name"] || data.vendor || "Auto-Detected Vendor",
                    date: data.Date || data.date || new Date().toISOString().split('T')[0],
                    amount: amount,
                    currency: currency,
                    convertedAmount: converted,
                    targetCurrency: baseCurrency,
                    description: data.Description || data.description || "Services Rendered",
                    category: data["Suggested Category"] || data.category || "Other",
                    fileName: selectedFile?.name || "Manual Text Entry",
                    docType: docType,
                    source: activeInputTab === 'upload' ? 'Upload' : 'Paste',
                    timestamp: new Date().toLocaleString()
                };
                setExtractedData(result);
                setHistory(prev => [result, ...prev]);
            } else {
                setError("Failed to parse document. Please try again.");
            }
        } catch (err) {
            console.error("Extraction error:", err);
            setError("AI Service error. Check your API key or connection.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleAddToTransactions = () => {
        if (!extractedData) return;
        
        const newTransaction: Transaction = { 
            id: `tx_ext_${Date.now()}`,
            date: extractedData.date, 
            description: `${extractedData.vendor} - ${extractedData.description}`, 
            amount: -extractedData.convertedAmount, 
            currency: extractedData.targetCurrency,
            type: 'expense', 
            category: extractedData.category,
            gl: '6000',
            status: 'posted',
            anomaly: null
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setExtractedData(null);
        setSelectedFile(null);
        setPastedText('');
        navigate('/transactions');
    };

    const capabilities = [
        "PDF invoice & receipt parsing",
        "Excel / CSV financial reports",
        "Multi-sheet workbook support",
        "Contract key terms extraction",
        "Line items & tax calculation",
        "Vendor / client identification",
        "Bank statement transactions",
        "Live exchange rate normalization"
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full">
            {/* Header with Global Currency Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold font-outfit text-white">AI Data Extraction</h2>
                    <p className="text-slate-500 text-sm mt-1">Multi-currency OCR & Autonomous Ledger Posting</p>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Reporting Currency</span>
                    <select 
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value)}
                        className="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
                    >
                        {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Column: Input */}
                <div className="premium-card p-6 space-y-6">
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button 
                            onClick={() => setActiveInputTab('upload')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${activeInputTab === 'upload' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Upload File
                        </button>
                        <button 
                            onClick={() => setActiveInputTab('paste')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${activeInputTab === 'paste' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Paste Text
                        </button>
                    </div>

                    <select 
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl focus:ring-sky-500 focus:border-sky-500 block p-3"
                    >
                        <option>Invoice</option>
                        <option>Receipt</option>
                        <option>Bank Statement</option>
                        <option>Contract</option>
                    </select>

                    <div 
                        className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer hover:bg-slate-800/30 hover:border-sky-500/50 transition-all"
                        onClick={handleFileClick}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.xlsx,.xls,.csv" />
                        
                        {activeInputTab === 'upload' ? (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 text-slate-600 group-hover:text-sky-500 mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12a4 4 0 014 4v1.586a1 1 0 01-.293.707l-1.414 1.414a1 1 0 00-.707.293H7z"></path></svg>
                                {selectedFile ? (
                                    <div className="text-center">
                                        <p className="text-sky-500 font-bold text-sm mb-1">{selectedFile.name}</p>
                                        <p className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                ) : (
                                    <p className="mb-2 text-sm text-slate-300"><span className="font-bold">Drop file here</span> or click to browse</p>
                                )}
                            </div>
                        ) : (
                            <textarea 
                                value={pastedText}
                                onChange={(e) => setPastedText(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Paste raw text from an invoice or bank statement here..."
                                className="w-full h-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 p-6 resize-none"
                            />
                        )}
                    </div>

                    <button 
                        onClick={handleExtract}
                        disabled={isProcessing || (activeInputTab === 'upload' && !selectedFile) || (activeInputTab === 'paste' && !pastedText.trim())}
                        className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800/50 disabled:text-slate-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isProcessing ? 'Analyzing Document...' : 'Extract with AI'}
                    </button>
                    
                    {error && (
                        <div className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Right Column: Output & Conversion */}
                <div className="space-y-8">
                    <div className="premium-card min-h-[320px] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                        {isProcessing ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="w-12 h-12 bg-slate-800 rounded-full mx-auto"></div>
                                <div className="h-4 w-48 bg-slate-800 rounded-full mx-auto"></div>
                            </div>
                        ) : extractedData ? (
                            <div className="w-full text-left space-y-6 animate-in zoom-in duration-300">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">AI Confidence 98%</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Verified Match</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <DetailField label="Vendor" value={extractedData.vendor} />
                                    <DetailField label="Date" value={extractedData.date} />
                                    
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Original Amount</p>
                                        <p className="text-xs text-slate-300 font-medium">{extractedData.currency} {extractedData.amount.toLocaleString()}</p>
                                    </div>

                                    <div className="space-y-1 p-2 bg-sky-500/5 rounded-lg border border-sky-500/10">
                                        <p className="text-[10px] text-sky-500 uppercase font-black tracking-widest">Converted to {baseCurrency}</p>
                                        <p className="text-lg text-white font-black">{baseCurrency} {extractedData.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>

                                    <DetailField label="Category" value={extractedData.category} />
                                    <DetailField label="Description" value={extractedData.description} />
                                </div>

                                <button onClick={handleAddToTransactions} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20">
                                    Approve & Post to Ledger ({baseCurrency})
                                </button>
                            </div>
                        ) : (
                            <div className="text-center opacity-40">
                                <div className="w-16 h-16 bg-slate-900/50 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-slate-800 shadow-inner text-2xl">🔍</div>
                                <h3 className="text-sm font-bold text-white mb-1">Waiting for document...</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Extraction ready</p>
                            </div>
                        )}
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Extraction Capabilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {capabilities.map((cap, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                                    <span className="text-slate-400 font-medium">{cap}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: History */}
            <div className="premium-card p-0 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/10">
                    <h3 className="text-sm font-bold font-outfit text-white uppercase tracking-widest">Recent Activity</h3>
                    <button onClick={() => alert("Audit Exporting...")} className="px-3 py-1.5 bg-slate-800 text-sky-400 text-[9px] font-black rounded-lg border border-slate-700/50 uppercase tracking-widest">Export Audit Trail</button>
                </div>
                {history.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-[9px] text-slate-500 uppercase font-black border-b border-slate-800 bg-slate-900/30">
                                <tr>
                                    <th className="px-6 py-4">Document</th>
                                    <th className="px-6 py-4">Vendor</th>
                                    <th className="px-6 py-4 text-right">Original</th>
                                    <th className="px-6 py-4 text-right text-sky-500">Converted ({baseCurrency})</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {history.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{item.fileName}</td>
                                        <td className="px-6 py-4 text-slate-300 font-bold">{item.vendor}</td>
                                        <td className="px-6 py-4 text-right text-slate-500">{item.currency} {item.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-white font-black">{baseCurrency} {item.convertedAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase border border-emerald-500/20">Verified</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">No processing history found</div>
                )}
            </div>
        </div>
    );
};

export const TransactionsPage: React.FC = () => {
    const { transactions, baseCurrency } = useContext(DataContext) as DataContextType;
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || tx.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All Types' || (typeFilter === 'Credit' ? tx.amount > 0 : tx.amount < 0);
        const matchesCategory = categoryFilter === 'All Categories' || tx.category === categoryFilter;
        return matchesSearch && matchesType && matchesCategory;
    });

    const totalCredits = transactions.reduce((acc, tx) => tx.amount > 0 ? acc + tx.amount : acc, 0);
    const totalDebits = transactions.reduce((acc, tx) => tx.amount < 0 ? acc + Math.abs(tx.amount) : acc, 0);

    const categoryTotals = transactions.reduce((acc: any, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
        return acc;
    }, {});

    const totalVolume = Object.values(categoryTotals).reduce((a: any, b: any) => a + b, 0) as number;
    const spendCategories = Object.entries(categoryTotals)
        .map(([name, amount]: [string, any]) => ({
            name,
            amountFormatted: `${baseCurrency} ${amount.toLocaleString()}`,
            percent: totalVolume > 0 ? `${((amount / totalVolume) * 100).toFixed(1)}%` : '0%',
            fill: totalVolume > 0 ? `${(amount / totalVolume) * 100}%` : '0%'
        }))
        .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));

    return (
        <div className="space-y-6 animate-in fade-in duration-700 w-full">
            <div>
                <h2 className="text-xl font-bold font-outfit text-[var(--text-main)]">Transaction Ledger</h2>
                <p className="text-[var(--text-muted)] text-sm mt-1">Full audit trail with AI categorization and anomaly scoring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="premium-card p-6 flex items-center gap-4">
                    <div className="w-1 h-12 bg-emerald-500 rounded-full"></div>
                    <div>
                        <p className="text-2xl font-black text-[var(--text-main)]">{baseCurrency} {totalCredits.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1 mt-1">
                            <span className="text-emerald-500">↗</span> Total Credits
                        </p>
                    </div>
                </div>
                <div className="premium-card p-6 flex items-center gap-4">
                    <div className="w-1 h-12 bg-rose-500 rounded-full"></div>
                    <div>
                        <p className="text-2xl font-black text-[var(--text-main)]">{baseCurrency} {totalDebits.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1 mt-1">
                            <span className="text-rose-500">↘</span> Total Debits
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--text-muted)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block pl-10 p-2.5 text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none" 
                        placeholder="Search transactions..." 
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-lg block p-2.5 w-full md:w-40 outline-none">
                        <option>All Types</option>
                        <option>Credit</option>
                        <option>Debit</option>
                    </select>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-lg block p-2.5 w-full md:w-40 outline-none">
                        <option>All Categories</option>
                        {Array.from(new Set(transactions.map(t => t.category))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <div className="premium-card p-0 overflow-hidden shadow-lg border-[var(--border-color)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-[var(--text-muted)]">
                        <thead className="text-[10px] text-[var(--text-muted)] uppercase font-bold border-b border-[var(--border-color)] tracking-wider bg-[var(--bg-input)]">
                            <tr>
                                <th className="px-6 py-4">DATE</th>
                                <th className="px-6 py-4">DESCRIPTION</th>
                                <th className="px-6 py-4">CATEGORY</th>
                                <th className="px-6 py-4">GL CODE</th>
                                <th className="px-6 py-4 text-right">AMOUNT</th>
                                <th className="px-6 py-4 text-center">STATUS</th>
                                <th className="px-6 py-4 text-center">ANOMALY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {filteredTransactions.map((tx, index) => (
                                <tr key={index} className="hover:bg-[var(--bg-input)] transition-colors">
                                    <td className="px-6 py-3">{tx.date}</td>
                                    <td className="px-6 py-3 font-semibold text-[var(--text-main)]">{tx.description}</td>
                                    <td className="px-6 py-3">{tx.category}</td>
                                    <td className="px-6 py-3 text-[var(--text-muted)]">{tx.gl}</td>
                                    <td className={`px-6 py-3 text-right font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-[var(--text-main)]'}`}>
                                        {tx.currency || baseCurrency} {tx.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tx.status === 'posted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {tx.anomaly ? <span className="text-rose-500 text-[10px] font-bold">{tx.anomaly}</span> : <span className="text-[var(--border-color)]">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="premium-card p-6">
                <h3 className="text-sm font-bold font-outfit mb-4 text-white">Spend by Category ({baseCurrency})</h3>
                <div className="space-y-3">
                    {spendCategories.map((cat, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                            <span className="w-40 text-slate-400 truncate">{cat.name}</span>
                            <div className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-sky-500 rounded-full" style={{ width: cat.fill }}></div>
                            </div>
                            <div className="w-32 flex justify-between font-medium">
                                <span className="text-slate-200">{cat.amountFormatted}</span>
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
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl max-w-7xl mx-auto space-y-12 border border-slate-200 dark:border-slate-800">
            <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white font-outfit">Workspace Settings</h2>
                <p className="text-slate-500 mt-2 font-medium">Manage your team, appearance, and organizational controls.</p>
            </div>

            <div className="space-y-12">
                <section className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Personalization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Dark Mode</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Toggle high-contrast interface</p>
                            </div>
                            <button 
                                onClick={toggleDarkMode}
                                className={`w-14 h-7 rounded-full transition-all relative ${isDarkMode ? 'bg-sky-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1 shadow-md'}`}></div>
                            </button>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Brand Color</p>
                            <div className="flex gap-4">
                                {Object.keys(THEMES).map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => applyTheme(name as ThemeName)}
                                        className="w-10 h-10 rounded-xl transition-all hover:scale-110 flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: THEMES[name as ThemeName].primary }}
                                    >
                                        {themeName === name && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Subscription</h3>
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-sky-500 text-white px-3 py-1.5 rounded-lg shadow-lg">Enterprise Pro Plan</span>
                                <h4 className="text-5xl font-black mt-6">$199<span className="text-xl font-normal text-slate-400 ml-2">/ month</span></h4>
                                <p className="text-sm text-slate-400 mt-4 font-medium italic">Active since January 2024 • Next billing cycle: **June 1, 2026**</p>
                            </div>
                            <button className="w-full md:w-auto px-12 py-5 bg-white text-slate-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1">
                                Manage Billing & Invoices
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};


// The following are simple placeholder pages.
export const ExpenseManagementPage: React.FC = () => {
    const [reports, setReports] = useState<ExpenseReport[]>([
        { id: 'ER-2025-003', submittedBy: 'Alice Johnson', description: 'Client Dinner - Q1 Strategy', amount: 450.50, date: '2025-05-01', status: 'Approved', category: 'Entertainment' },
        { id: 'ER-2025-002', submittedBy: 'Bob Williams', description: 'AWS Monthly Infrastructure', amount: 1200.00, date: '2025-04-28', status: 'Pending', category: 'Software' },
        { id: 'ER-2025-001', submittedBy: 'Nidhal Shaikh', description: 'Office Supplies & Ergonomic Chair', amount: 850.00, date: '2025-04-15', status: 'Rejected', category: 'Operations' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ExpenseReport | null>(null);
    const [newReport, setNewReport] = useState({
        description: '',
        amount: '',
        category: 'Travel',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const report: ExpenseReport = {
            id: `ER-2025-00${reports.length + 1}`,
            submittedBy: 'Nidhal Shaikh',
            description: newReport.description,
            amount: parseFloat(newReport.amount),
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            category: newReport.category
        };
        setReports([report, ...reports]);
        setIsModalOpen(false);
        setNewReport({ description: '', amount: '', category: 'Travel' });
    };

    const { setTransactions } = useContext(DataContext) as DataContextType;

    const handleStatusChange = (id: string, newStatus: ExpenseReport['status']) => {
        setReports(prev => {
            const updated = prev.map(r => r.id === id ? { ...r, status: newStatus } : r);
            
            // If approved, add to global transactions
            if (newStatus === 'Approved') {
                const report = updated.find(r => r.id === id);
                if (report) {
                    setTransactions(prevTx => [
                        {
                            id: `tx_exp_${report.id}`,
                            date: report.date,
                            description: `Expense: ${report.description} (${report.submittedBy})`,
                            amount: -report.amount, // Negative for expense
                            type: 'expense',
                            category: report.category,
                            status: 'posted'
                        },
                        ...prevTx
                    ]);
                }
            }
            
            return updated;
        });

        if (selectedReport?.id === id) {
            setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white font-outfit tracking-tight">Expense Intelligence</h2>
                    <p className="text-slate-500 font-medium mt-1">Track, review, and approve organizational spending.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group relative px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                >
                    <span className="uppercase tracking-widest text-[10px] font-black">+ Submit New Report</span>
                </button>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <th className="px-8 py-4">Report Details</th>
                                <th className="px-8 py-4">Category</th>
                                <th className="px-8 py-4 text-right">Amount</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5 bg-slate-800/40 rounded-l-2xl border-y border-l border-slate-700/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-sky-400 shadow-inner">
                                                {report.id.split('-').pop()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{report.description}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{report.submittedBy} • {report.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 bg-slate-800/40 border-y border-slate-700/50">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
                                            {report.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 bg-slate-800/40 border-y border-slate-700/50 text-right">
                                        <span className="text-sm font-black text-white">${report.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </td>
                                    <td className="px-8 py-5 bg-slate-800/40 border-y border-slate-700/50">
                                        <div className="relative group/status w-fit">
                                            <select 
                                                value={report.status}
                                                onChange={(e) => handleStatusChange(report.id, e.target.value as any)}
                                                className={`text-[9px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer appearance-none pr-4 ${
                                                    report.status === 'Approved' ? 'text-emerald-500' : 
                                                    report.status === 'Pending' ? 'text-amber-500' : 'text-rose-500'
                                                }`}
                                            >
                                                <option value="Approved">Approved</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 scale-75">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 bg-slate-800/40 rounded-r-2xl border-y border-r border-slate-700/50 text-center">
                                        <button 
                                            onClick={() => setSelectedReport(report)}
                                            className="text-[10px] font-black text-sky-500 hover:text-sky-400 uppercase tracking-widest transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submission Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent"></div>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white font-outfit uppercase tracking-wider">New Expense Report</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                                <input required value={newReport.description} onChange={(e) => setNewReport({...newReport, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-sky-500/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount ($)</label>
                                    <input required type="number" step="0.01" value={newReport.amount} onChange={(e) => setNewReport({...newReport, amount: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                                    <select value={newReport.category} onChange={(e) => setNewReport({...newReport, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm">
                                        <option value="Travel">Travel</option><option value="Software">Software</option><option value="Entertainment">Entertainment</option><option value="Operations">Operations</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 bg-slate-800 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-4 bg-sky-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/20">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-full max-w-2xl bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em]">Report Details</span>
                                    <h3 className="text-3xl font-black text-white font-outfit mt-2">{selectedReport.id}</h3>
                                </div>
                                <button onClick={() => setSelectedReport(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Purpose</p>
                                        <p className="text-lg font-bold text-white leading-relaxed">{selectedReport.description}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Submitted By</p>
                                        <p className="text-white font-bold">{selectedReport.submittedBy}</p>
                                        <p className="text-xs text-slate-500 font-medium">{selectedReport.date}</p>
                                    </div>
                                </div>
                                <div className="space-y-8 text-right">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Amount</p>
                                        <p className="text-4xl font-black text-sky-500 font-outfit">${selectedReport.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                                        <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            selectedReport.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                            selectedReport.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                        }`}>
                                            {selectedReport.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 p-2 bg-slate-800/50 rounded-[2rem] border border-slate-700/50">
                                <button 
                                    onClick={() => handleStatusChange(selectedReport.id, 'Rejected')}
                                    className="flex-1 py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Reject Report
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(selectedReport.id, 'Approved')}
                                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Approve Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

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
                    <h2 className="text-2xl font-black font-outfit text-[var(--text-main)]">AI Auto-Reconciliation</h2>
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
    const [isExporting, setIsExporting] = useState(false);
    const { transactions, setTransactions } = useContext(DataContext) as DataContextType;

    const [anomalies, setAnomalies] = useState([
        { id: 1, vendor: "AWS Cloud Services", date: "2026-05-12", amount: "$9,100", reason: "30% Price Drift vs Avg", level: "High", status: 'Pending' },
        { id: 2, vendor: "Suspicious Transfer", date: "2026-04-30", amount: "$45,000", reason: "Unregistered Entity", level: "Critical", status: 'Pending' },
        { id: 3, vendor: "Duplicate Payment", date: "2026-03-25", amount: "$12,000", reason: "Duplicate Vendor ID", level: "Critical", status: 'Pending' },
        { id: 4, vendor: "Client Dinner", date: "2026-05-07", amount: "$5,200", reason: "Benford's Law Deviation", level: "Medium", status: 'Pending' },
    ]);

    const [selectedAnomaly, setSelectedAnomaly] = useState<any | null>(null);

    const handleExportAuditLog = async () => {
        setIsExporting(true);
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('FiNet Security Audit Log', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        const tableData = anomalies.map(a => [a.date, a.vendor, a.amount, a.reason, a.level]);
        (autoTable as any)(doc, {
            startY: 40,
            head: [['Date', 'Vendor', 'Amount', 'Reason', 'Risk Level']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [14, 165, 233] }
        });

        doc.save(`FiNet_Audit_Log_${new Date().toISOString().split('T')[0]}.pdf`);
        setIsExporting(false);
    };

    const handleReviewPost = (id: number) => {
        const anomaly = anomalies.find(a => a.id === id);
        if (anomaly) {
            // Update global transactions: Find matching tx and update it
            setTransactions(prev => prev.map(tx => {
                const amountMatches = Math.abs(tx.amount) === parseFloat(anomaly.amount.replace(/[^0-9.]/g, ''));
                const descriptionMatches = tx.description.toLowerCase().includes(anomaly.vendor.toLowerCase());
                if (amountMatches && descriptionMatches) {
                    return { ...tx, status: 'posted' as any, anomaly: null as any };
                }
                return tx;
            }));
        }

        setAnomalies(anomalies.map(a => a.id === id ? { ...a, status: 'Reviewed' } : a));
        setSelectedAnomaly(null);
    };

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const insights = await geminiService.getRiskInsights(transactions);
            setAiInsights(insights);
        } catch (err) {
            setAiInsights("Failed to generate strategic insights. Ensure your transactions are loaded.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const riskVectors = [
        { label: "Payroll Spikes", risk: "Low", value: 15, color: "bg-emerald-500" },
        { label: "Duplicate Billing", risk: "Critical", value: 85, color: "bg-rose-500" },
        { label: "Unknown Vendors", risk: "High", value: 65, color: "bg-amber-500" },
        { label: "Shadow SaaS", risk: "Medium", value: 45, color: "bg-sky-500" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit text-[var(--text-main)]">Risk & Audit Discovery</h2>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-widest font-bold">Continuous Intelligence Mode Active</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleExportAuditLog}
                        disabled={isExporting}
                        className="px-4 py-2 bg-[var(--bg-input)] hover:bg-[var(--border-color)] text-[var(--text-main)] text-xs font-bold rounded-xl transition-all border border-[var(--border-color)] flex items-center gap-2"
                    >
                        {isExporting ? <div className="w-3 h-3 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div> : 'Export Audit Log'}
                    </button>
                    <button 
                        onClick={runAnalysis}
                        disabled={isAnalyzing}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isAnalyzing ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Thinking...</>
                        ) : (
                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Run AI Risk Audit</>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card bg-slate-900/50 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Risk Exposure</p>
                    <p className="text-3xl font-black text-white">$54,220</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-full font-bold animate-pulse">CRITICAL</span>
                        <p className="text-[10px] text-slate-500 font-medium">Potential Fraud Detected</p>
                    </div>
                </div>
                <div className="premium-card bg-slate-900/50 border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open Anomalies</p>
                    <p className="text-3xl font-black text-white">{anomalies.filter(a => a.status === 'Pending').length}</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full font-bold">+3 vs LAST MONTH</span>
                    </div>
                </div>
                <div className="premium-card bg-slate-900/50 border-emerald-500/20">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Audit Readiness</p>
                    <p className="text-3xl font-black text-emerald-500">A-</p>
                    <div className="mt-4 flex items-center gap-2">
                        <p className="text-[10px] text-slate-500 font-medium">92% Compliance Match Rate</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: AI Summary & Heatmap */}
                <div className="space-y-6">
                    <div className="premium-card bg-slate-900 overflow-hidden relative min-h-[300px]">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-6 font-outfit flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                            AI Audit Intelligence
                        </h3>
                        {aiInsights ? (
                            <div className="text-slate-300 text-xs leading-relaxed space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <div dangerouslySetInnerHTML={{ __html: aiInsights.replace(/\n/g, '<br/>') }}></div>
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
                                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">No audit data generated</p>
                                <button onClick={runAnalysis} className="text-[10px] font-black text-sky-500 hover:text-sky-400 transition-colors uppercase tracking-tighter underline underline-offset-4">Run Strategic Deep Dive</button>
                            </div>
                        )}
                    </div>

                    <div className="premium-card">
                        <h3 className="text-sm font-bold text-white mb-6 font-outfit">Risk Heatmap (Real-time)</h3>
                        <div className="space-y-6">
                            {riskVectors.map((vector, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="font-bold text-slate-300 uppercase tracking-widest">{vector.label}</span>
                                        <span className={`font-black uppercase ${vector.risk === 'Critical' ? 'text-rose-500' : vector.risk === 'High' ? 'text-amber-500' : 'text-emerald-500'}`}>{vector.risk} RISK</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${vector.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${vector.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Anomaly Feed */}
                <div className="premium-card p-0 flex flex-col h-full min-h-[500px]">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/10">
                        <h3 className="text-sm font-bold text-white font-outfit">Priority Anomaly Feed</h3>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Requiring Immediate CFO Attention</p>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                        {anomalies.map((anomaly, idx) => (
                            <div key={idx} className={`p-6 border-b border-slate-800 transition-all group ${anomaly.status === 'Reviewed' ? 'opacity-40 grayscale' : 'hover:bg-slate-800/30 cursor-pointer'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${anomaly.level === 'Critical' && anomaly.status === 'Pending' ? 'bg-rose-500 animate-ping' : anomaly.level === 'Critical' ? 'bg-rose-500' : anomaly.level === 'High' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <h4 className="font-bold text-white text-sm">{anomaly.vendor}</h4>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase">{anomaly.date}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[11px] text-slate-400 font-medium">{anomaly.reason}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">
                                                {anomaly.status === 'Reviewed' ? '✓ REVIEWED' : 'TAG: AUDIT_REQUIRED'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white">{anomaly.amount}</p>
                                        {anomaly.status === 'Pending' && (
                                            <button 
                                                onClick={() => setSelectedAnomaly(anomaly)}
                                                className="text-[10px] font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                Review & Post →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-900/50 text-center border-t border-slate-800">
                        <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">View All Anomalies</button>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {selectedAnomaly && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-white font-outfit uppercase tracking-widest mb-4">Post Audit Entry</h3>
                        <div className="p-5 bg-slate-800/50 rounded-2xl mb-8 space-y-4 border border-slate-700/50">
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Vendor</span>
                                <span className="text-sm font-bold text-white">{selectedAnomaly.vendor}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Amount</span>
                                <span className="text-sm font-black text-sky-500">{selectedAnomaly.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Reason</span>
                                <span className="text-xs text-slate-400">{selectedAnomaly.reason}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setSelectedAnomaly(null)} className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Cancel</button>
                            <button onClick={() => handleReviewPost(selectedAnomaly.id)} className="flex-1 py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all">Review & Post</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RiskMetric: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
    <div>
        <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest text-slate-500">
            <span>{label}</span>
            <span>{score}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }}></div>
        </div>
    </div>
);

export const ScenarioPlanningPage: React.FC = () => {
    const [revenueGrowth, setRevenueGrowth] = useState(15);
    const [opexReduction, setOpexReduction] = useState(5);
    const [hiringCount, setHiringCount] = useState(2);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiVerdict, setAiVerdict] = useState<string | null>(null);

    const generateProjections = (growth: number, reduction: number, hiring: number) => {
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let cash = 450000; // Starting cash
        return months.map((month, i) => {
            const growthFactor = 1 + (growth / 100);
            const savingsFactor = 1 - (reduction / 100);
            const hiringCost = hiring * 12000; // $12k per new hire (fully burdened)
            
            const revenue = 120000 * Math.pow(growthFactor, i/4);
            const expenses = (95000 * savingsFactor) + hiringCost;
            cash += (revenue - expenses);
            
            return {
                name: month,
                Cash: Math.round(cash),
                Expenses: Math.round(expenses),
                Revenue: Math.round(revenue)
            };
        });
    };

    const baselineData = generateProjections(8, 0, 1); // Conservative baseline
    const scenarioData = generateProjections(revenueGrowth, opexReduction, hiringCount);

    const combinedData = scenarioData.map((d, i) => ({
        ...d,
        "Baseline Cash": baselineData[i].Cash,
        "Scenario Cash": d.Cash
    }));

    const runAiSimulation = async () => {
        setIsAnalyzing(true);
        const scenarioText = `Scenario: ${revenueGrowth}% Revenue Growth, ${opexReduction}% OpEx Reduction, ${hiringCount} new hires. Current Cash: $450,000.`;
        try {
            const verdict = await geminiService.getFinancialInsight(`Analyze this financial scenario for a SaaS CFO: ${scenarioText}. Is it sustainable? What are the risks?`);
            setAiVerdict(verdict);
        } catch (err) {
            setAiVerdict("Simulation failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit text-white">Strategic "What-If" Sandbox</h2>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Simulating Future Cashflow Paths</p>
                </div>
                <button 
                    onClick={runAiSimulation}
                    disabled={isAnalyzing}
                    className="btn-primary flex items-center gap-2"
                >
                    {isAnalyzing ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Thinking...</>
                    ) : (
                        <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.8 1.451l-9 14.5a1 1 0 01-1.822-.858L4.7 6.727l-3.21.366a1 1 0 01-.848-1.591l9-14.5a1 1 0 011.458-.055z" clipRule="evenodd"></path></svg> Run AI Simulation</>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="premium-card bg-slate-900/50">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8">Scenario Variables</h3>
                        <div className="space-y-10">
                            <SliderControl label="Revenue Growth" value={revenueGrowth} min={-20} max={100} unit="%" onChange={setRevenueGrowth} />
                            <SliderControl label="OpEx Optimization" value={opexReduction} min={0} max={40} unit="%" onChange={setOpexReduction} />
                            <SliderControl label="Strategic Hiring" value={hiringCount} min={0} max={20} unit=" Hires" onChange={setHiringCount} />
                        </div>
                        <div className="mt-12 pt-8 border-t border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Impact on Runway</span>
                                <span className="text-sm font-black text-white">14.2 Months</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[70%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card bg-sky-500/10 border-sky-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">AI Strategic Verdict</span>
                        </div>
                        {aiVerdict ? (
                            <p className="text-xs text-slate-300 leading-relaxed italic">"{aiVerdict}"</p>
                        ) : (
                            <p className="text-xs text-slate-500 leading-relaxed">Adjust variables and run simulation to see AI-powered feasibility analysis.</p>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 premium-card">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-white font-outfit">Projected Cash: Scenario vs Baseline</h3>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-slate-700"></div> Baseline
                            </div>
                            <div className="flex items-center gap-1.5 text-sky-400">
<div className="w-2 h-2 rounded-full bg-sky-400"></div> Strategy A
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={combinedData}>
                                <defs>
                                    <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} tickFormatter={(v) => `$${v/1000}k`} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '11px'}} />
                                <Area type="monotone" dataKey="Baseline Cash" stroke="#334155" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                <Area type="monotone" dataKey="Scenario Cash" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScenario)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SliderControl: React.FC<{ label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }> = ({ label, value, min, max, unit, onChange }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
            <span className={`text-sm font-black ${value >= 0 ? 'text-white' : 'text-rose-500'}`}>{value}{unit}</span>
        </div>
        <input 
            type="range" min={min} max={max} value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-tighter">
            <span>{min}{unit}</span>
            <span>{max}{unit}</span>
        </div>
    </div>
);

export const ESGReportingPage: React.FC = () => {
    const { transactions } = useContext(DataContext) as DataContextType;
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [esgAudit, setEsgAudit] = useState<string | null>(null);

    // Mock carbon calculation logic
    const carbonFootprint = transactions.reduce((acc, t) => {
        if (t.category === 'Travel' || t.category === 'Logistics') return acc + (t.amount * 0.0008);
        if (t.category === 'Hosting' || t.category === 'Software') return acc + (t.amount * 0.00015);
        return acc + (t.amount * 0.00005);
    }, 0).toFixed(2);

    const runEsgAudit = async () => {
        setIsAnalyzing(true);
        try {
            const audit = await geminiService.getSustainabilityAudit(transactions);
            setEsgAudit(audit);
        } catch (err) {
            setEsgAudit("ESG Audit failed. Please verify API configuration.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit text-white">Sustainability & Impact (ESG)</h2>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Real-time Carbon Tracking & Social Audit</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={runEsgAudit}
                        disabled={isAnalyzing}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-slate-700 transition-all flex items-center gap-2"
                    >
                        {isAnalyzing ? (
                            <><div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div> Auditing...</>
                        ) : (
                            <><span className="text-sm">⚡</span> Run AI ESG Audit</>
                        )}
                    </button>
                    <button className="btn-primary">Export Disclosure</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <EsgCard 
                    label="Environmental (E)" 
                    value={`${carbonFootprint} tCO2e`} 
                    trend="-12%" 
                    color="text-emerald-500" 
                    metric="Total Scope 1-3 Emissions"
                    icon="🌱"
                />
                <EsgCard 
                    label="Social (S)" 
                    value="42%" 
                    trend="+4.2%" 
                    color="text-sky-500" 
                    metric="Diversity & Vendor Equity"
                    icon="🤝"
                />
                <EsgCard 
                    label="Governance (G)" 
                    value="88/100" 
                    trend="A+" 
                    color="text-amber-500" 
                    metric="Audit & Control Score"
                    icon="⚖️"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="premium-card">
                    <h3 className="text-sm font-bold text-white mb-6 font-outfit">Emissions Intensity by Department</h3>
                    <div className="space-y-6">
                        <DepartmentImpact label="Logistics & Delivery" percentage={65} color="bg-rose-500" />
                        <DepartmentImpact label="Cloud Operations" percentage={45} color="bg-sky-500" />
                        <DepartmentImpact label="Office Facilities" percentage={12} color="bg-emerald-500" />
                        <DepartmentImpact label="Supply Chain" percentage={28} color="bg-amber-500" />
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="premium-card bg-emerald-500/5 border-emerald-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z"></path></svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Sustainability Audit Summary</span>
                        </div>
                        {esgAudit ? (
                            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {esgAudit}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 leading-relaxed">Run the ESG Audit to generate a strategic summary of your environmental and social impact based on expenditure data.</p>
                        )}
                    </div>

                    <div className="premium-card border-slate-800">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Regulatory Roadmap</h3>
                        <div className="space-y-3">
                            <ComplianceRow label="CSRD Directive" status="Pending Data" isWarning />
                            <ComplianceRow label="SFDR Article 8" status="Compliant" />
                            <ComplianceRow label="SOC2 Compliance" status="Active" />
                        </div>
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

const DepartmentImpact: React.FC<{ label: string; percentage: number; color?: string }> = ({ label, percentage, color = "bg-emerald-500" }) => (
    <div>
        <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
            <span>{label}</span>
            <span>{percentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
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
    const [isGenerating, setIsGenerating] = useState(false);
    const [briefing, setBriefing] = useState<string | null>(null);

    const marketInsights = [
      { id: 1, type: 'Alert', title: 'Inflation Spike', description: 'Headline inflation rose to 4.2%. Projecting 12% increase in cloud hosting costs next quarter.', urgency: 'High' },
      { id: 2, type: 'Opportunity', title: 'Currency Fluctuation', description: 'USD/EUR rate is favorable for EU service expansion. Now is a strategic time for relocation of Euro-denominated debt.', urgency: 'Med' },
      { id: 3, type: 'Competitor', title: 'New Product Launch', description: 'Main competitor "FinFlow" launched a new payroll module. Customer sentiment indicates high interest in automated tax filing.', urgency: 'Low' },
    ];

    const generateBriefing = async () => {
        setIsGenerating(true);
        try {
            const summary = await geminiService.getMarketBriefing(marketInsights);
            setBriefing(summary);
        } catch (err) {
            setBriefing("Failed to generate briefing. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit text-white">Global Market Intelligence</h2>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">AlphaSense-Style AI Synthesis Active</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-700 transition-all">Source Config</button>
                    <button 
                        onClick={generateBriefing}
                        disabled={isGenerating}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Synthesizing...</>
                        ) : (
                            "Generate Analyst Briefing"
                        )}
                    </button>
                </div>
            </div>

            {briefing && (
                <div className="premium-card bg-indigo-500/5 border-indigo-500/20 animate-in slide-in-from-top duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white font-outfit">AI Strategic Briefing</h3>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Confidential • For CFO Eyes Only</p>
                            </div>
                        </div>
                        <button onClick={() => setBriefing(null)} className="text-slate-500 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-w-4xl">
                        {briefing}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card">
                        <h3 className="text-sm font-bold text-white font-outfit mb-6">Strategic News Synthesis</h3>
                        <div className="space-y-6">
                            {marketInsights.map(insight => (
                                <div key={insight.id} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 group hover:border-sky-500/50 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${insight.urgency === 'High' ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white'}`}>
                                                {insight.type}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-500">Source: Global Finance Wire • 2h ago</span>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-2">{insight.title}</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-4">
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded">Bullish Exposure</span>
                                        <span className="text-[10px] font-bold text-slate-500 underline cursor-pointer hover:text-sky-400 transition-colors">Read Full Synthesis</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="premium-card">
                        <h3 className="text-sm font-bold text-white font-outfit mb-6">Market Sentiment Heatmap</h3>
                        <div className="space-y-6">
                            <SentimentIndex label="Small Business Confidence" score={62} status="Bullish" color="text-emerald-500" />
                            <SentimentIndex label="SaaS Sector Multiples" score={48} status="Neutral" color="text-amber-500" />
                            <SentimentIndex label="Central Bank Stance" score={25} status="Hawkish" color="text-rose-500" />
                        </div>
                    </div>

                    <div className="premium-card bg-gradient-to-br from-indigo-900 to-slate-900 border-none shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">Competitor Edge</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] font-black text-indigo-300 mb-1">FinFlow (Tier 1)</p>
                                <p className="text-xs text-indigo-100">Launched automated VAT filing. Current user sentiment is mixed due to latency.</p>
                            </div>
                            <button className="w-full py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-400 transition-all">
                                View Intelligence Map
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
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSummary, setAiSummary] = useState<string | null>(null);

    const ssaData = [
        { name: 'Jan', MRR: 45000, Churn: 2.1, LTV: 10200, CAC: 950 },
        { name: 'Feb', MRR: 48000, Churn: 1.9, LTV: 10500, CAC: 920 },
        { name: 'Mar', MRR: 52000, Churn: 2.3, LTV: 11000, CAC: 980 },
        { name: 'Apr', MRR: 58000, Churn: 1.5, LTV: 11800, CAC: 890 },
        { name: 'May', MRR: 65000, Churn: 1.2, LTV: 12100, CAC: 850 },
        { name: 'Jun', MRR: 72000, Churn: 1.0, LTV: 12450, CAC: 840 },
    ];

    const generateHealthCheck = async () => {
        setIsAnalyzing(true);
        try {
            const summary = await geminiService.getExecutiveSummary(ssaData[ssaData.length - 1]);
            setAiSummary(summary);
        } catch (err) {
            setAiSummary("Unable to perform health check.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black font-outfit text-[var(--text-main)]">Executive Insights</h2>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-widest font-bold">Unit Economics & High-Level Strategy</p>
                </div>
                <button 
                    onClick={generateHealthCheck}
                    disabled={isAnalyzing}
                    className="px-6 py-2 bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                >
                    {isAnalyzing ? (
                        <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Running Check...</>
                    ) : (
                        "Run AI Strategic Health Check"
                    )}
                </button>
            </div>

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
                    <h3 className="text-sm font-bold text-white font-outfit mb-6">Revenue Growth (MRR)</h3>
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
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} tickFormatter={(v) => `$${v/1000}k`} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '11px'}} />
                                <Area type="monotone" dataKey="MRR" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="premium-card">
                    <h3 className="text-sm font-bold text-white font-outfit mb-6">Monthly Churn Analysis</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ssaData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} tickFormatter={(v) => `${v}%`} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '11px'}} />
                                <Bar dataKey="Churn" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="premium-card bg-slate-900 border-sky-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.5 9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>
                </div>
                <div className="flex items-center gap-4 mb-6 relative">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-2xl">💡</div>
                    <div>
                        <h3 className="text-lg font-bold text-white font-outfit">AI Strategic Recommendation</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Based on LTV:CAC and Current Runway</p>
                    </div>
                </div>
                <div className="relative">
                    {aiSummary ? (
                        <p className="text-slate-300 leading-relaxed max-w-4xl text-sm italic">
                            "{aiSummary}"
                        </p>
                    ) : (
                        <p className="text-slate-400 leading-relaxed max-w-4xl text-sm">
                            Your LTV:CAC ratio of **14.8x** is significantly above the industry benchmark (3.0x). 
                            Click the health check button above for a detailed strategic synthesis of your business unit economics.
                        </p>
                    )}
                </div>
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

export const UserManagementPage: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([
        { id: '1', name: 'Nidhal Shaikh', email: 'nidhal@finet.ai', role: 'Admin', status: 'Active' },
        { id: '2', name: 'Alice Johnson', email: 'alice@finet.ai', role: 'Finance Manager', status: 'Active' },
    ]);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Employee' as UserRole });
    const [notification, setNotification] = useState<string | null>(null);

    const handleAddUser = async () => {
        if (!formData.email || !formData.name) return;
        
        const setupLink = `http://localhost:3000/#/setup-password?token=${Math.random().toString(36).substr(2)}`;
        
        const newUser: TeamMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: 'Invited'
        };

        setTeam([...team, newUser]);
        
        // Real Email Dispatch via Mailtrap
        const sent = await mailService.sendInvitation({
            to: formData.email,
            name: formData.name,
            role: formData.role,
            setupLink
        });

        if (sent) {
            setNotification(`Invitation sent to ${formData.email} via Mailtrap.`);
        } else {
            setNotification(`User added, but email failed (Check .env credentials).`);
        }
        
        setTimeout(() => setNotification(null), 5000);

        setFormData({ name: '', email: '', role: 'Employee' });
        setIsInviteOpen(false);
    };

    const handleResendInvite = async (member: TeamMember) => {
        const setupLink = `http://localhost:3000/#/setup-password?token=${Math.random().toString(36).substr(2)}`;
        
        setNotification(`Resending invite to ${member.email}...`);
        
        const sent = await mailService.sendInvitation({
            to: member.email,
            name: member.name,
            role: member.role,
            setupLink
        });

        if (sent) {
            setNotification(`Reminder sent to ${member.email}.`);
        } else {
            setNotification(`Failed to resend email to ${member.email}.`);
        }
        
        setTimeout(() => setNotification(null), 5000);
    };

    const handleDelete = (id: string) => {
        setTeam(team.filter(m => m.id !== id));
    };

    const handleRoleChange = (id: string, role: UserRole) => {
        setTeam(team.map(m => m.id === id ? { ...m, role } : m));
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {notification && (
                <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right duration-500">
                    <div className="bg-sky-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
                        <span className="text-2xl">✉️</span>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest">System Notification</p>
                            <p className="text-sm font-medium">{notification}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black font-outfit text-white">User Management</h2>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">Admin Controls • {team.length} Total Users</p>
                </div>
                <button 
                    onClick={() => setIsInviteOpen(true)}
                    className="group relative px-8 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-2 overflow-hidden"
                >
                    <span className="relative z-10">+ Add New Team Member</span>
                    <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </div>

            {isInviteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="premium-card bg-slate-900 border-sky-500/30 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white font-outfit">Add New Member</h3>
                            <button onClick={() => setIsInviteOpen(false)} className="text-slate-500 hover:text-white transition-colors text-2xl">&times;</button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter name" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="email@company.com" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace Role</label>
                                <select 
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 appearance-none"
                                >
                                    <option value="Admin">Admin (Full Access)</option>
                                    <option value="Finance Manager">Finance Manager (Operations)</option>
                                    <option value="Analyst">Analyst (Read-Only)</option>
                                    <option value="Employee">Employee (Basic)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button 
                                onClick={handleAddUser}
                                className="flex-1 py-4 bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all shadow-lg"
                            >
                                Confirm & Add User
                            </button>
                            <button 
                                onClick={() => setIsInviteOpen(false)}
                                className="px-8 py-4 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="premium-card overflow-hidden p-0 border border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Team Member</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Access Level</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {team.map(member => (
                                <tr key={member.id} className="group hover:bg-slate-800/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-sm font-black text-sky-500 shadow-xl group-hover:scale-110 transition-transform">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{member.name}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="relative group/select">
                                            <select 
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                                                className="bg-slate-800/50 border border-transparent hover:border-slate-700 rounded-lg px-3 py-1.5 text-[10px] text-slate-300 font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Finance Manager">Finance Manager</option>
                                                <option value="Analyst">Analyst</option>
                                                <option value="Employee">Employee</option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                member.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 
                                                member.status === 'Invited' ? 'bg-sky-500' : 'bg-rose-500'
                                            }`}></div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                member.status === 'Active' ? 'text-emerald-500' : 
                                                member.status === 'Invited' ? 'text-sky-500' : 'text-rose-500'
                                            }`}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right flex items-center justify-end gap-4">
                                        {member.status === 'Invited' && (
                                            <button 
                                                onClick={() => handleResendInvite(member)}
                                                className="text-[9px] font-black text-sky-500 hover:text-sky-400 uppercase tracking-widest transition-colors"
                                            >
                                                Resend Invite
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(member.id)}
                                            className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                                        >
                                            Revoke Access
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="premium-card bg-slate-900 border-amber-500/20 lg:col-span-2">
                    <div className="flex gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl">🛡️</div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-4 font-outfit">Access Control Overview</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Full Permissions</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">**Admin** can modify all financial rules, manage integrations, and invite/remove any user.</p>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Operations Access</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">**Finance Manager** can approve ledger changes and trigger What-If simulations.</p>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Read-Only Strategy</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">**Analyst** can view all dashboards and intelligence reports but cannot modify data.</p>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Restricted Basic</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">**Employee** access is limited to their own expense reports and general chat help.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="premium-card bg-slate-900 border-sky-500/20 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-xl">📑</div>
                            <h4 className="text-sm font-bold text-white font-outfit">Security Audit Trail</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5"></div>
                                <p className="text-[10px] text-slate-500 italic">"Admin added user Alice Johnson with role: Finance Manager"</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5"></div>
                                <p className="text-[10px] text-slate-500 italic">"Security Policy updated for multi-factor auth"</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all mt-8">
                        Export Security Log
                    </button>
                </div>
            </div>
        </div>
    );
};
export const AutonomousBookkeepingPage: React.FC = () => {
    const { transactions, setTransactions, baseCurrency } = useContext(DataContext) as DataContextType;
    const [isApproving, setIsApproving] = useState(false);
    
    // Filter for transactions that are "pending" or have AI flags
    const pendingReview = transactions.filter(t => t.status === 'pending' || t.anomaly);
    
    const handleApproveAll = async () => {
        setIsApproving(true);
        await new Promise(r => setTimeout(r, 1500));
        setTransactions(prev => prev.map(t => ({ ...t, status: 'posted' })));
        setIsApproving(false);
    };

    const handleApproveSingle = (id?: string) => {
        if (!id) return;
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'posted' } : t));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold font-outfit text-[var(--text-main)]">Autonomous AI Bookkeeping</h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1">AI-driven ledger verification and anomaly resolution</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleApproveAll}
                        disabled={pendingReview.length === 0 || isApproving}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-[var(--bg-input)] disabled:text-[var(--text-muted)] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2"
                    >
                        {isApproving ? 'Verifying...' : `Approve All Proposals (${pendingReview.length})`}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card flex flex-col justify-between p-6">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">AI Confidence Rate</p>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-black text-[var(--text-main)]">98.4%</span>
                        <span className="text-[10px] text-emerald-500 font-bold mb-1">↑ 2.1%</span>
                    </div>
                </div>
                <div className="premium-card flex flex-col justify-between p-6">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Auto-Categorizations</p>
                    <div className="mt-2">
                        <span className="text-3xl font-black text-[var(--text-main)]">{transactions.length}</span>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Items processed this month</p>
                    </div>
                </div>
                <div className="premium-card flex flex-col justify-between p-6">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Human Verification</p>
                    <div className="mt-2">
                        <span className="text-3xl font-black text-amber-500">{pendingReview.length}</span>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Items awaiting approval</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold font-outfit text-[var(--text-main)] px-1">AI Proposal Queue</h3>
                
                {pendingReview.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingReview.map((tx, idx) => (
                            <div key={tx.id || idx} className={`premium-card p-6 border-l-4 ${tx.anomaly ? 'border-rose-500' : 'border-sky-500'} animate-in slide-in-from-bottom-2 duration-300 shadow-sm`} style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-muted)] uppercase tracking-widest">{tx.date}</span>
                                            {tx.anomaly && (
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 uppercase tracking-widest border border-rose-500/20">Anomaly Detected</span>
                                            )}
                                        </div>
                                        <h4 className="text-lg font-bold text-[var(--text-main)]">{tx.description}</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-[var(--text-muted)]">Suggested GL:</span>
                                                <span className="text-[10px] font-black text-sky-500">{tx.gl}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-[var(--text-muted)]">Category:</span>
                                                <span className="text-[10px] font-black text-[var(--text-main)]">{tx.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-color)] flex-1 w-full lg:max-w-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                                            <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">AI Reasoning</p>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
                                            {tx.anomaly 
                                                ? `Caution: Transaction amount is 300% higher than historical average for '${tx.category}'. Requires manual sign-off.` 
                                                : `Matched vendor signature against historical record. High confidence mapping to '${tx.category}' ledger.`}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto">
                                        <div className="text-right mb-2 lg:mb-4 pr-2">
                                            <p className="text-2xl font-black text-[var(--text-main)]">{baseCurrency} {Math.abs(tx.amount).toLocaleString()}</p>
                                            <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">{tx.amount < 0 ? 'Debit / Expense' : 'Credit / Revenue'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleApproveSingle(tx.id)}
                                                className="flex-1 sm:px-6 py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                                            >
                                                Approve
                                            </button>
                                            <button className="flex-1 sm:px-6 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all">
                                                Adjust
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="premium-card py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-[var(--bg-input)] rounded-full flex items-center justify-center text-2xl">🎉</div>
                        <div>
                            <h4 className="text-lg font-bold text-[var(--text-main)]">Ledger is Fully Synchronized</h4>
                            <p className="text-sm text-[var(--text-muted)] mt-1">No items currently require human verification.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
