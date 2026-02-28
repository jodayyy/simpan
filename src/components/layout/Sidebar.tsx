import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, Target, User } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Commitments', href: '/commitments', icon: Receipt },
  { name: 'Savings Goals', href: '/savings', icon: Target },
  { name: 'Profile', href: '/profile', icon: User },
];

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`hidden md:flex md:flex-col md:border-r md:bg-background md:fixed md:inset-y-0 md:top-16 transition-all duration-300 ${
        collapsed ? 'md:w-16' : 'md:w-64'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors overflow-hidden ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="size-5.5 shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
