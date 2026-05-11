import { NavLink } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-ink border-b border-ink-muted/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <Users size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            User<span className="text-accent">Directory</span>
          </span>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent/20 text-accent'
                  : 'text-slate-mid hover:text-white hover:bg-ink-soft'
              }`
            }
          >
            <Users size={15} />
            List
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent/20 text-accent'
                  : 'text-slate-mid hover:text-white hover:bg-ink-soft'
              }`
            }
          >
            <UserPlus size={15} />
            Add
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
