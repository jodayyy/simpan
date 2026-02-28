import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, Target, User } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Commitments', href: '/commitments', icon: Receipt },
  { name: 'Savings', href: '/savings', icon: Target },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex h-16 p-2 gap-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors rounded-md ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
