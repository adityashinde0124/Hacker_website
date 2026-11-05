import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Terminal as TerminalIcon, Activity, Key, Mail } from 'lucide-react';

export default function AttackSimulation() {
  const [attackType, setAttackType] = useState('MITM');
  const [wallet, setWallet] = useState('');
  const [email, setEmail] = useState('example@example.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [displayedLogs, setDisplayedLogs] = useState([]);

  const attackOptions = ['MITM', 'Session Hijacking', 'Address Poisoning'];

  useEffect(() => {
    let interval;
    if (result && result.logs) {
      let currentLogIndex = 0;
      setDisplayedLogs([]);
      interval = setInterval(() => {
        if (result && result.logs && currentLogIndex < result.logs.length) {
          const nextLog = result.logs[currentLogIndex];
          if (nextLog) {
            setDisplayedLogs(prev => [...prev, nextLog]);
          }
          currentLogIndex++;
        } else {
          clearInterval(interval);
        }
      }, 400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [result]);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!wallet) return;

    setLoading(true);
    setResult(null);
    setDisplayedLogs([]);

    try {
      const response = await fetch('http://localhost:5000/simulate-attack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attack_type: attackType,
          target_wallet: wallet,
          target_email: email,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setDisplayedLogs(['[ERROR] Simulation failed. Check server connection.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white font-['Outfit'] mb-2 flex items-center gap-3">
          <TerminalIcon className="text-cyber-neon-blue" size={32} />
          Attack Simulation Dashboard
        </h2>
        <p className="text-cyber-light/60 text-sm max-w-3xl">
          Secure educational environment for simulating Web3 cyber attacks on crypto transactions. 
          Use this module to visualize how threat actors operate and how our defense systems neutralize them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="cyber-card p-6 flex flex-col h-full bg-cyber-bg border border-cyber-surface/60 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <h3 className="text-lg font-bold text-cyber-neon-blue mb-6 font-mono border-b border-cyber-surface pb-2">TARGET_CONFIG //</h3>
          <form onSubmit={handleSimulate} className="space-y-6 flex-1 flex flex-col justify-start">
            <div>
              <label className="block text-xs font-mono text-cyber-light/80 mb-2">TARGET_WALLET_ADDRESS</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-light/40" size={16} />
                <input 
                  type="text" 
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x..." 
                  className="w-full bg-cyber-surface/30 border border-cyber-surface focus:border-cyber-neon-blue rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder:text-cyber-light/40 outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyber-light/80 mb-2">TARGET_EMAIL_ACCOUNT</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-light/40" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com" 
                  className="w-full bg-cyber-surface/30 border border-cyber-surface focus:border-cyber-neon-blue rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder:text-cyber-light/40 outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyber-light/80 mb-2">ATTACK_VECTOR</label>
              <div className="grid grid-cols-1 gap-3">
                {attackOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAttackType(opt)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all text-sm font-medium ${
                      attackType === opt 
                        ? 'bg-cyber-neon-blue/10 border-cyber-neon-blue text-cyber-neon-blue shadow-[0_0_10px_rgba(102,252,241,0.2)]' 
                        : 'bg-cyber-surface/20 border-cyber-surface/50 text-cyber-light hover:border-cyber-surface'
                    }`}
                  >
                    {opt}
                    {attackType === opt && <Activity size={16} className="animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <button 
                type="submit"
                disabled={loading || !wallet}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 rounded-lg font-bold tracking-widest text-sm transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-red-400/10 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {loading ? (
                  <><Activity size={18} className="animate-spin" /> SIMULATING...</>
                ) : (
                  <><Shield size={18} /> LAUNCH SIMULATION</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Terminal Panel */}
        <div className="bg-[#050505] border border-cyber-surface rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col h-[500px]">
          <div className="bg-cyber-surface/30 px-4 py-2 border-b border-cyber-surface flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs font-mono text-cyber-light/60">attack_terminal.sh</span>
          </div>
          
          <div className="p-4 font-mono text-sm h-full overflow-y-auto space-y-2 flex-1">
            <div className="text-cyber-light/40 mb-4">
              Type 'help' for commands.<br/>
              --- WAITING FOR EXECUTION ---
            </div>
            
            {displayedLogs.map((log, index) => {
               if (typeof log !== 'string') return null;
               
               let logColor = "text-cyber-light";
               if (log.includes("[!]")) logColor = "text-yellow-400";
               if (log.includes("ALERT") || log.includes("[ERROR]")) logColor = "text-red-500 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]";
               if (log.includes("[+]")) logColor = "text-cyber-neon-blue";
               if (log.includes("[SUCCESS]") || log.includes("[ACTION]")) logColor = "text-cyber-neon-green text-shadow-glow-green";

               return (
                <div key={`${index}-${log.substring(0, 10)}`} className="opacity-0 animate-fade-in transition-all duration-300">
                  <span className={logColor}>{log}</span>
                </div>
               );
            })}
            
            {loading && !result && (
              <div className="text-cyber-neon-blue animate-pulse flex items-center gap-2">
                <span>_</span> initiating connection sequence...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results / Defensive Panel */}
      {result && (
        <div className="cyber-card p-6 bg-gradient-to-r from-cyber-bg to-cyber-surface/10 border border-cyber-surface/80 rounded-xl mt-6 animate-fade-in-up shadow-[0_0_20px_rgba(102,252,241,0.05)]">
          <div className="flex items-center justify-between mb-6 border-b border-cyber-surface/50 pb-4">
             <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
               <Shield className="text-cyber-neon-green" /> 
               DEFENSE REPORT
             </h3>
             <span className="px-3 py-1 bg-cyber-neon-green/20 text-cyber-neon-green border border-cyber-neon-green/50 rounded text-xs font-mono font-bold flex items-center gap-2">
               <CheckCircle size={14} /> STATUS: {result.status}
             </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cyber-surface/10 p-4 rounded-lg border border-red-500/20">
              <div className="text-xs text-cyber-light/60 font-mono mb-1 flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400"/>
                THREAT SEVERITY
              </div>
              <div className="text-2xl font-black text-red-500">{result.severity}</div>
            </div>
            
            <div className="bg-cyber-surface/10 p-4 rounded-lg border border-cyber-surface/50 col-span-2">
               <div className="text-xs text-cyber-light/60 font-mono mb-1">PREVENTION ACTION_</div>
               <div className="text-sm text-cyber-neon-green font-mono whitespace-pre-line leading-relaxed">
                 {result?.prevention_action || "Neutralizing threat..."}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
