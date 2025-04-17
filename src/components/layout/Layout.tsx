
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-6 pb-20 md:pb-6 container mx-auto max-w-lg">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
