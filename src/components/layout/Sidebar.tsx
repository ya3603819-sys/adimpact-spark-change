import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Eye, 
  Trophy, 
  PlusCircle, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
  Users,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'الرئيسية',
      href: '/',
      icon: Home,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      hoverColor: 'hover:bg-primary/20',
    },
    {
      name: 'استكشف الإعلانات',
      href: '/ads',
      icon: Eye,
      color: 'text-brand-secondary',
      bgColor: 'bg-brand-secondary/10',
      hoverColor: 'hover:bg-brand-secondary/20',
    },
    {
      name: 'المتصدرون',
      href: '/leaderboard',
      icon: Trophy,
      color: 'text-brand-accent',
      bgColor: 'bg-brand-accent/10',
      hoverColor: 'hover:bg-brand-accent/20',
    },
  ];

  const userNavigation = [
    {
      name: 'إنشاء إعلان',
      href: '/create',
      icon: PlusCircle,
      color: 'text-brand-success',
      bgColor: 'bg-brand-success/10',
      hoverColor: 'hover:bg-brand-success/20',
    },
    {
      name: 'الإحصائيات',
      href: '/stats',
      icon: BarChart3,
      color: 'text-brand-warning',
      bgColor: 'bg-brand-warning/10',
      hoverColor: 'hover:bg-brand-warning/20',
    },
  ];

  const bottomNavigation = [
    {
      name: 'الإعدادات',
      href: '/settings',
      icon: Settings,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      hoverColor: 'hover:bg-muted',
    },
    {
      name: 'المساعدة',
      href: '/help',
      icon: HelpCircle,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      hoverColor: 'hover:bg-muted',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-background/95 backdrop-blur-md border-r border-border/40 transition-all duration-300 ease-in-out glass-effect',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-4 border-b border-border/40">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold gradient-text font-amiri">منصة الإعلانات</h2>
              <p className="text-xs text-muted-foreground">المؤثرة</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-lg hover:bg-muted/50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-full p-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-cairo">
              التنقل الرئيسي
            </h3>
          )}
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 group relative',
                  isActive(item.href)
                    ? `${item.bgColor} ${item.color} shadow-sm`
                    : `text-muted-foreground ${item.hoverColor}`,
                  isCollapsed ? 'justify-center' : ''
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 transition-transform group-hover:scale-110',
                  isActive(item.href) ? item.color : ''
                )} />
                {!isCollapsed && (
                  <span className="font-medium font-cairo">{item.name}</span>
                )}
                
                {isActive(item.href) && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Navigation */}
        {user && (
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-cairo">
                أدوات المبدع
              </h3>
            )}
            {userNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 group relative',
                    isActive(item.href)
                      ? `${item.bgColor} ${item.color} shadow-sm`
                      : `text-muted-foreground ${item.hoverColor}`,
                    isCollapsed ? 'justify-center' : ''
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5 transition-transform group-hover:scale-110',
                    isActive(item.href) ? item.color : ''
                  )} />
                  {!isCollapsed && (
                    <span className="font-medium font-cairo">{item.name}</span>
                  )}
                  
                  {isActive(item.href) && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Stats Card */}
        {!isCollapsed && user && (
          <div className="tech-card p-4 rounded-2xl space-y-3">
            <h4 className="text-sm font-semibold gradient-text font-cairo">إحصائياتك</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-muted-foreground">الإعجابات</span>
                </div>
                <span className="text-sm font-bold">245</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">المتابعين</span>
                </div>
                <span className="text-sm font-bold">1.2K</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-auto space-y-2 border-t border-border/40 pt-4">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 group',
                  isActive(item.href)
                    ? `${item.bgColor} ${item.color}`
                    : `text-muted-foreground ${item.hoverColor}`,
                  isCollapsed ? 'justify-center' : ''
                )}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                {!isCollapsed && (
                  <span className="font-medium font-cairo">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}