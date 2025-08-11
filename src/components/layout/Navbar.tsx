import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { PlusCircle, Trophy, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-blue-200/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">AdImpact</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Link to="/create" className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4" />
                <span>إنشاء إعلان</span>
              </Link>
            </Button>
              
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Link to="/leaderboard" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>المتصدرون</span>
              </Link>
            </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md">
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}