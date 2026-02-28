import { useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import PageTransition from './PageTransition';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
        <main className="p-6 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            <PageTransition>
              {children}
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
