import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  PlusCircle, 
  Trophy, 
  LogOut, 
  User, 
  Sparkles,
  Home,
  Eye,
  ChevronDown,
  Settings,
  HelpCircle,
  ImageIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass-effect shadow-lg backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-brand-secondary to-brand-accent flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full animate-ping"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold gradient-text-dynamic font-amiri">منصة الإعلانات</span>
            <span className="text-xs text-muted-foreground font-cairo">المؤثرة</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl font-cairo group relative"
          >
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>🏠 الرئيسية</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-brand-secondary hover:bg-brand-secondary/10 transition-all duration-300 rounded-xl font-cairo group relative"
          >
            <Link to="/ads" className="flex items-center space-x-2">
              <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>🌟 استكشف الإعلانات</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-brand-accent hover:bg-brand-accent/10 transition-all duration-300 rounded-xl font-cairo group relative"
          >
            <Link to="/leaderboard" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>🏆 المتصدرون</span>
              <Badge variant="secondary" className="ml-2 animate-pulse">جديد</Badge>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-purple-400 hover:bg-purple-400/10 transition-all duration-300 rounded-xl font-cairo group relative"
          >
            <Link to="/image-maker" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>🎨 مولد الصور</span>
            </Link>
          </Button>

          {user && (
            <Button
              variant="default"
              size="sm"
              asChild
              className="btn-glow font-cairo font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/create" className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4" />
                <span>✨ إنشاء إعلان</span>
              </Link>
            </Button>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-12 w-auto px-4 rounded-2xl tech-card hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-brand-secondary text-white font-bold">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-right">
                      <div className="text-sm font-semibold gradient-text">مرحباً بك</div>
                      <div className="text-xs text-muted-foreground">المبدع</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:rotate-180 transition-transform duration-300" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass-card border-0 shadow-2xl" align="end" forceMount>
                <DropdownMenuLabel className="font-cairo">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold gradient-text">حسابي</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                
                <DropdownMenuItem className="focus:bg-primary/10 font-cairo group">
                  <Settings className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>⚙️ الإعدادات</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="focus:bg-brand-secondary/10 font-cairo group">
                  <HelpCircle className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>❓ المساعدة</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-border/50" />
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="focus:bg-destructive/10 text-destructive focus:text-destructive font-cairo group"
                >
                  <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span>🚪 تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="glass-effect hover:glass-card border-primary/20 hover:border-primary/40 font-cairo transition-all duration-300"
              >
                <Link to="/auth">تسجيل الدخول</Link>
              </Button>
              <Button 
                asChild 
                variant="default" 
                size="sm" 
                className="btn-glow font-cairo font-semibold"
              >
                <Link to="/auth">🚀 ابدأ الآن</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-around py-3">
          <Link 
            to="/" 
            className="flex flex-col items-center space-y-1 text-xs font-cairo text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>الرئيسية</span>
          </Link>
          
          <Link 
            to="/ads" 
            className="flex flex-col items-center space-y-1 text-xs font-cairo text-muted-foreground hover:text-brand-secondary transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>الإعلانات</span>
          </Link>
          
          <Link 
            to="/leaderboard" 
            className="flex flex-col items-center space-y-1 text-xs font-cairo text-muted-foreground hover:text-brand-accent transition-colors"
          >
            <Trophy className="h-4 w-4" />
            <span>المتصدرون</span>
          </Link>
          
          <Link 
            to="/image-maker" 
            className="flex flex-col items-center space-y-1 text-xs font-cairo text-muted-foreground hover:text-purple-400 transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            <span>مولد الصور</span>
          </Link>
          
          {user && (
            <Link 
              to="/create" 
              className="flex flex-col items-center space-y-1 text-xs font-cairo text-primary font-semibold"
            >
              <div className="p-2 bg-primary rounded-full">
                <PlusCircle className="h-4 w-4 text-white" />
              </div>
              <span>إنشاء</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}