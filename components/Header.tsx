import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { getFinancialInsight } from '../services/geminiService';
import { ThemeContext } from '../App';
import { ThemeContextType } from '../types';

interface HeaderProps {
  title: string;
}

// Custom hook to detect clicks outside a referenced element
const useClickOutside = <T extends HTMLElement,>(ref: React.RefObject<T>, handler: () => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const themeContext = useContext(ThemeContext) as ThemeContextType;

    const closePopup = useCallback(() => setIsPopupVisible(false), []);
    useClickOutside(searchContainerRef, closePopup);

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim() !== '') {
            setIsLoading(true);
            setIsPopupVisible(true);
            setResponse('');
            // Simulate contextual data retrieval
            const result = await getFinancialInsight(`${query}. (Context: User is CFO of FiNet, current cash is $125k, burn rate is $15k/mo)`);
            setResponse(result);
            setIsLoading(false);
        }
    };

    return (
        <header className="flex-shrink-0 flex justify-between items-center px-10 py-6 bg-transparent">
            <div>
                <h1 className="text-3xl font-black font-outfit tracking-tight text-[var(--text-main)]">
                    {title}
                </h1>
                <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div ref={searchContainerRef} className="relative w-80">
                    <input
                        id="ai-search-bar"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Ask FiNet AI..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] text-sm shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                    />
                    <svg className="w-4 h-4 text-[var(--text-muted)] absolute top-1/2 left-3.5 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    
                    {isPopupVisible && (
                        <div className="absolute top-full right-0 mt-3 w-[400px] premium-card z-50 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)]">FiNet Intelligence</p>
                            </div>
                            {isLoading ? (
                                 <div className="py-8 text-center">
                                    <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-xs text-[var(--text-muted)]">Analyzing data...</p>
                                </div>
                            ) : (
                                <p className="text-sm leading-relaxed text-[var(--text-main)] whitespace-pre-wrap">{response}</p>
                            )}
                            <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-end">
                                <button onClick={closePopup} className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)]">Dismiss</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)]">
                    <button 
                        onClick={() => themeContext.toggleDarkMode()}
                        className={`p-2 rounded-lg transition-all ${!themeContext.isDarkMode ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                    <button 
                        onClick={() => themeContext.toggleDarkMode()}
                        className={`p-2 rounded-lg transition-all ${themeContext.isDarkMode ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;