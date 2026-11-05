import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-cyber-bg text-cyber-light">
      <div className="scanline"></div>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden z-10 relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
