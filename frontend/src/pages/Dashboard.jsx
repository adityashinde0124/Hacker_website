import { useState, useEffect, useRef } from 'react';
import { Activity, Shield, AlertTriangle, Terminal as TerminalIcon, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const StatCard = ({ title, value, icon: Icon, colorClass, delay = "0" }) => (
  <div 
    className="cyber-card p-6 border border-cyber-surface/60 rounded-xl bg-cyber-bg shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-cyber-surface/30 rounded-lg ${colorClass} shadow-[0_0_10px_currentColor]`}>
        <Icon size={24} />
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon-blue animate-pulse"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon-blue animate-pulse delay-75"></div>
      </div>
    </div>
    <h3 className="text-cyber-light/60 text-xs font-bold mb-1 uppercase tracking-[0.2em] font-mono">{title}</h3>
    <p className={`text-3xl font-black font-['Outfit'] tracking-tight ${colorClass.replace('text-', 'text-shadow-glow-')}`}>
      {value}
    </p>
  </div>
);

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [liveFeed, setLiveFeed] = useState([]);
  const [status, setStatus] = useState({
    threats_neutralized: 0,
    system_health: '100%',
    active_monitors: 3,
    status: 'OPTIMAL'
  });
  
  const feedRef = useRef(null);

  useEffect(() => {
    // Initialize graph with some baseline points
    const initialData = Array.from({ length: 15 }, (_, i) => ({
      name: new Date(Date.now() - (15 - i) * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      monitored: 100 + Math.floor(Math.random() * 50),
      suspicious: Math.floor(Math.random() * 10),
      neutralized: Math.floor(Math.random() * 5)
    }));
    setChartData(initialData);

    const fetchData = async () => {
      try {
        // 1. Live Monitoring Metrics
        const monRes = await fetch('http://localhost:5000/live-monitoring-data');
        const monData = await monRes.json();
        
        setChartData(prev => {
          const newData = [...prev, {
            name: monData.timestamp,
            monitored: monData.monitored_tx % 1000, // Keep values readable
            suspicious: monData.suspicious_patterns,
            neutralized: monData.neutralized_threats
          }].slice(-20); // Keep last 20 points
          return newData;
        });

        // 2. Real-time Threat Feed
        const feedRes = await fetch('http://localhost:5000/realtime-threat-feed');
        const feedData = await feedRes.json();
        setLiveFeed(feedData);

        // 3. Status/Summary
        const statusRes = await fetch('http://localhost:5000/detection-status');
        const statusData = await statusRes.json();
        setStatus(statusData);

      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // 3-second live refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Live Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
             <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">Live SOC Monitoring</span>
          </div>
          <h2 className="text-4xl font-black text-white font-['Outfit'] tracking-tight">Security Operations Center</h2>
        </div>
        
        <div className="flex gap-3">
           <div className="bg-cyber-surface/30 px-4 py-2 rounded-lg border border-cyber-surface flex items-center gap-3">
              <Globe size={16} className="text-cyber-neon-blue" />
              <div className="text-left">
                 <p className="text-[10px] text-cyber-light/40 uppercase font-bold">Network</p>
                 <p className="text-xs font-mono text-cyber-neon-blue">Mainnet_Alpha_V4</p>
              </div>
           </div>
           <div className="bg-cyber-surface/30 px-4 py-2 rounded-lg border border-cyber-surface flex items-center gap-3">
              <Lock size={16} className="text-cyber-neon-green" />
              <div className="text-left">
                 <p className="text-[10px] text-cyber-light/40 uppercase font-bold">Protocol</p>
                 <p className="text-xs font-mono text-cyber-neon-green">AES-256_GCM</p>
              </div>
           </div>
        </div>
      </div>

      {/* Real-time Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Threats Neutralized" value={status.threats_neutralized} icon={ShieldCheck} colorClass="text-red-500" delay="100" />
        <StatCard title="Security Health" value={status.system_health} icon={Activity} colorClass="text-cyber-neon-green" delay="200" />
        <StatCard title="Active Sensors" value={status.active_monitors} icon={Zap} colorClass="text-cyber-neon-blue" delay="300" />
        <StatCard title="Firewall Status" value={status.status} icon={Shield} colorClass="text-yellow-400" delay="400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Live Graph */}
        <div className="cyber-card p-6 xl:col-span-2 border border-cyber-surface rounded-xl bg-cyber-bg shadow-[0_0_25px_rgba(0,0,0,0.6)] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Activity size={120} />
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Activity className="text-cyber-neon-blue" size={20} />
                Blockchain Real-Time Monitoring
              </h3>
              <p className="text-xs text-cyber-light/40 font-mono mt-1">Live transaction scanning & anomaly detection</p>
            </div>
            
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-sm bg-cyber-neon-blue"></div>
                 <span className="text-[10px] font-bold text-cyber-light/60 uppercase">Monitored</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-sm bg-yellow-500"></div>
                 <span className="text-[10px] font-bold text-cyber-light/60 uppercase">Suspicious</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                 <span className="text-[10px] font-bold text-cyber-light/60 uppercase">Neutralized</span>
               </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#66fcf1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNeu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2833" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#45a29e" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis stroke="#45a29e" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0c10', borderColor: '#1f2833', borderRadius: '4px', fontSize: '10px' }}
                  itemStyle={{ padding: '0px' }}
                />
                <Area type="monotone" dataKey="monitored" stroke="#66fcf1" strokeWidth={2} fillOpacity={1} fill="url(#colorMon)" animationDuration={1000} />
                <Area type="monotone" dataKey="suspicious" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorSus)" animationDuration={1000} />
                <Area type="monotone" dataKey="neutralized" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorNeu)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Live Threat Feed Terminal */}
        <div className="cyber-card flex flex-col border border-cyber-surface rounded-xl bg-[#050505] shadow-[0_0_20px_rgba(0,0,0,0.8)] h-[500px] xl:h-full">
           <div className="bg-cyber-surface/30 px-4 py-3 border-b border-cyber-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-cyber-neon-blue" />
                <span className="text-[10px] font-black font-mono text-cyber-light/80 tracking-widest uppercase">Live_Threat_Feed.log</span>
              </div>
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
              </div>
           </div>
           
           <div 
             className="p-4 font-mono text-[11px] overflow-y-auto flex-1 space-y-3 scrollbar-hide"
             ref={feedRef}
           >
              {liveFeed.length > 0 ? liveFeed.map((item, idx) => (
                <div key={idx} className="border-l-2 border-cyber-surface pl-3 py-1 animate-fade-in">
                  <div className="flex justify-between items-start mb-1">
                     <span className="text-cyber-light/40">[{item.timestamp}]</span>
                     <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                       item.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                       item.severity === 'HIGH' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-cyber-neon-blue/20 text-cyber-neon-blue'
                     }`}>
                       {item.severity}
                     </span>
                  </div>
                  <p className="text-white font-bold mb-0.5">{item.event}</p>
                  <p className="text-cyber-light/60 flex items-center gap-2">
                    Target: <span className="text-cyber-neon-blue">{item.target}</span>
                  </p>
                  <p className="text-cyber-neon-green flex items-center gap-2 mt-1">
                    <ShieldCheck size={10} /> {item.status}
                  </p>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-cyber-light/20 gap-3">
                   <Activity size={40} className="animate-pulse" />
                   <p className="uppercase tracking-[0.2em] animate-pulse">Initializing Streams...</p>
                </div>
              )}
           </div>
           
           <div className="p-3 border-t border-cyber-surface bg-cyber-bg/50">
              <div className="flex items-center gap-2 text-[9px] font-mono text-cyber-light/40">
                 <span className="w-1.5 h-1.5 rounded-full bg-cyber-neon-green animate-pulse"></span>
                 UPSTREAM: ETH_MAINNET_NODE_01
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
