import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getFinancialInsight } from '../services/geminiService';

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

    const closePopup = useCallback(() => setIsPopupVisible(false), []);
    useClickOutside(searchContainerRef, closePopup);

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim() !== '') {
            setIsLoading(true);
            setIsPopupVisible(true);
            setResponse('');
            const result = await getFinancialInsight(query);
            setResponse(result);
            setIsLoading(false);
        }
    };

    return (
        <header className="flex-shrink-0 mb-6 flex justify-between items-center p-6 md:p-10 md:pt-10 md:pb-0">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{title}</h1>
            <div ref={searchContainerRef} className="relative w-full max-w-md">
                <input
                    id="ai-search-bar"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    placeholder="Ask FiNet: 'What was my net income in June?'"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                />
                <svg className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {isPopupVisible && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-700 rounded-lg shadow-xl p-4 border border-slate-200 dark:border-slate-600 animate-fadeIn">
                        <p className="font-semibold text-slate-700 dark:text-slate-200">FiNet Response:</p>
                        {isLoading ? (
                             <div className="text-center p-4">
                                <div className="loader mx-auto"></div>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Thinking...</p>
                            </div>
                        ) : (
                            <p className="text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{response}</p>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;