import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Shield, Eye, Sun, Moon, ChevronDown } from 'lucide-react';
import { toggleMobileSidebar, toggleTheme, setRole } from '../../store/slices/uiSlice';

const roles = [
  { value: 'admin', label: 'Admin', icon: Shield, color: 'text-primary', bg: 'bg-primary-light', border: 'border-primary/20', activeBg: 'bg-primary', dot: 'bg-primary' },
  { value: 'viewer', label: 'Viewer', icon: Eye, color: 'text-warning', bg: 'bg-warning-light', border: 'border-warning/20', activeBg: 'bg-warning', dot: 'bg-warning' },
];

export default function Header({ title, subtitle }) {
  const dispatch = useDispatch();
  const { role, theme } = useSelector(s => s.ui);
  const [tilting, setTilting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentRole = roles.find(r => r.value === role);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleThemeToggle = () => {
    setTilting(true);
    dispatch(toggleTheme());
    setTimeout(() => setTilting(false), 500);
  };

  const handleRoleSelect = (value) => {
    dispatch(setRole(value));
    setDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between h-[var(--spacing-header)] px-6 bg-bg-secondary border-b border-border sticky top-0 z-50 backdrop-blur-[12px] max-lg:px-4 max-[360px]:px-3" id="main-header">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="hidden max-lg:flex text-text-secondary p-2 rounded-md transition-all duration-150 hover:text-text-primary hover:bg-bg-elevated shrink-0"
          onClick={() => dispatch(toggleMobileSidebar())}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex flex-col min-w-0">
          <h1 className="text-xl font-bold text-text-primary leading-tight max-sm:text-lg max-[360px]:text-base truncate">{title || 'Dashboard'}</h1>
          {subtitle && <p className="text-[0.8125rem] text-text-muted leading-tight max-[360px]:hidden">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Custom Role Select Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 border cursor-pointer ${currentRole.bg} ${currentRole.color} ${currentRole.border} hover:brightness-110`}
          >
            <currentRole.icon size={14} />
            <span className="max-[360px]:hidden">{currentRole.label}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 opacity-60 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] bg-bg-secondary border border-border rounded-lg shadow-lg z-[60] min-w-[150px] py-1 animate-fade-in overflow-hidden">
              {roles.map(r => {
                const Icon = r.icon;
                const isActive = role === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => handleRoleSelect(r.value)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? `${r.bg} ${r.color}`
                        : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{r.label}</span>
                    {isActive && (
                      <div className={`ml-auto w-2 h-2 rounded-full ${r.dot}`} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Toggle with tilt animation */}
        <button
          className={`flex items-center justify-center w-9 h-9 rounded-xl bg-bg-primary border border-border text-text-secondary transition-all duration-300 hover:text-text-primary hover:bg-bg-elevated hover:border-text-muted hover:shadow-[0_0_16px_rgba(59,130,246,0.15)] ${
            tilting ? 'animate-theme-tilt' : ''
          }`}
          onClick={handleThemeToggle}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
