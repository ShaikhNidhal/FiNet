import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarSection } from '../types';
import { SIDEBAR_SECTIONS } from '../constants';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col p-4 flex-shrink-0">
      <div className="text-2xl font-bold text-center mb-10 border-b border-slate-700 pb-4 text-white">
        <span className="text-[var(--color-primary)]">FiNet</span>
      </div>
      <nav className="flex-grow overflow-y-auto">
        {SIDEBAR_SECTIONS.map((section: SidebarSection) => (
          <div key={section.title} className="mb-4">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{section.title}</p>
            <ul className="space-y-2">
              {section.links.map(link => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className="sidebar-link flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white"
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="pt-4 border-t border-slate-700 mt-4">
        <button onClick={onLogout} className="sidebar-link w-full flex items-center p-3 rounded-lg text-left">
          <svg className="sidebar-icon w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
        <div className="text-center mt-2">
            <p className="text-sm text-slate-400">NET Labs</p>
            <p className="text-xs text-slate-500">&copy; 2025</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;