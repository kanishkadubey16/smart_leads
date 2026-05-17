import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Layers, LogOut, Shield, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <nav className="w-full bg-white border-b border-slate-100 px-6 sm:px-12 py-4 flex items-center justify-between select-none relative z-50">
      {/* Brand logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
          <Layers className="w-5 h-5" />
        </div>
        <span className="text-lg font-extrabold text-slate-900 tracking-tight">
          Smart Leads
        </span>
      </div>

      {/* Profile / Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 transition-all duration-200 outline-none cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-lg border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-200">
            👩‍💻
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2.5 w-[260px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 p-5 flex flex-col gap-4 animate-fadeIn z-50">
            {/* Header info */}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-950 truncate">
                {user.name}
              </span>
              <span className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                {user.email}
              </span>
              
              <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-slate-400 tracking-wider">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>ROLE: {user.role}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50/50 active:bg-rose-50 font-bold text-xs transition-colors duration-150 outline-none cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
