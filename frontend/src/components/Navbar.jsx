import { Bell, ShieldAlert, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-cyber-surface/60 bg-cyber-bg/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 text-cyber-neon-blue">
        <ShieldAlert size={24} className="animate-pulse" />
        <h1 className="text-xl font-bold font-['Outfit'] tracking-wider hidden sm:block">
          CYBER SECURITY <span className="text-cyber-light font-light">DASHBOARD</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-cyber-surface/50 text-cyber-light hover:text-cyber-neon-blue transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-cyber-surface pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-cyber-light">System Admin</p>
            <p className="text-xs text-cyber-neon-green">Online</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-cyber-surface flex items-center justify-center border border-cyber-neon-blue/30">
            <User size={18} className="text-cyber-neon-blue" />
          </div>
        </div>
      </div>
    </header>
  );
}
