import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Shield, Activity, Terminal as TerminalIcon } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Defense Output', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Simulate Attack', path: '/simulate', icon: TerminalIcon },
  ];

  return (
    <aside className="w-64 bg-cyber-bg border-r border-cyber-surface/60 flex-shrink-0 flex flex-col hidden md:flex z-20 relative">
      <div className="h-16 flex items-center justify-center border-b border-cyber-surface/60">
        <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyber-neon-blue tracking-widest font-['Outfit']">
          CYBER_DEFENSE //
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <p className="text-xs text-cyber-surface font-semibold mb-4 tracking-widest uppercase">System Control</p>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-cyber-surface text-cyber-neon-blue border-l-2 border-cyber-neon-blue shadow-[inset_0_0_10px_rgba(102,252,241,0.1)]'
                      : 'text-cyber-light hover:bg-cyber-surface/50 hover:text-white'
                  }`
                }
              >
                <Icon size={20} className="group-hover:animate-pulse" />
                <span className="font-medium">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-cyber-surface/60">
        <div className="bg-cyber-surface/30 p-3 rounded-lg border border-cyber-surface text-xs font-mono">
          <div className="flex justify-between mb-1">
            <span className="text-cyber-light/60">SYS_STATUS</span>
            <span className="text-cyber-neon-green font-bold">MONITORING</span>
          </div>
          <div className="w-full bg-cyber-bg h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyber-neon-green h-full w-[100%] shadow-[0_0_5px_#45a29e] animate-pulse"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
