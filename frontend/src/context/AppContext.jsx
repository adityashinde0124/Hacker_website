import { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Check session storage on initial load
  const [logsUnlocked, setLogsUnlocked] = useState(() => {
    return sessionStorage.getItem('logsUnlocked') === 'true';
  });

  const unlockLogs = () => {
    setLogsUnlocked(true);
    sessionStorage.setItem('logsUnlocked', 'true');
  };

  const lockLogs = () => {
    setLogsUnlocked(false);
    sessionStorage.setItem('logsUnlocked', 'false');
  };

  return (
    <AppContext.Provider value={{ logsUnlocked, unlockLogs, lockLogs }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
