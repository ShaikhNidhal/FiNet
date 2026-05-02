import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarSection } from '../types';
import { SIDEBAR_SECTIONS } from '../constants';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const proLinks = ["/reconciliation", "/risk-discovery", "/scenario-planning", "/market-intelligence"];

  return (
    <aside className="w-72 bg-[#020617] text-slate-300 flex flex-col p-6 flex-shrink-0 border-r border-slate-800/50">
      <div className="mb-10 pl-2">
        <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tighter">
          Fi<span className="text-[var(--color-primary)]">Net</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">Strategic Intelligence</p>
      </div>

      <nav className="flex-grow overflow-y-auto space-y-8 custom-scrollbar">
        {SIDEBAR_SECTIONS.map((section: SidebarSection) => (
          <div key={section.title}>
            <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-4">{section.title}</p>
            <ul className="space-y-1">
              {section.links.map(link => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) => 
                      `flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
                        isActive 
                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold' 
                        : 'hover:bg-slate-800/50 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center">
                        <span className="opacity-70 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                        <span className="text-sm ml-1">{link.label}</span>
                    </div>
                    {proLinks.includes(link.href) && (
                        <span className="text-[8px] font-black bg-[var(--color-primary)] text-white px-1.5 py-0.5 rounded-md uppercase">Pro</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800/50 mt-6 space-y-4">
        <button 
            onClick={onLogout} 
            className="w-full flex items-center p-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 transition-all text-sm font-medium"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout Session
        </button>
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-sky-400"></div>
                <div>
                    <p className="text-xs font-bold text-white">Nidhal Shaikh</p>
                    <p className="text-[10px] text-slate-500 font-medium">CFO @ FiNet</p>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;