import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "مرحباً بك!",
        description: "تم تسجيل الدخول بنجاح",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      username: formData.username,
    });
    
    if (error) {
      toast({
        title: "خطأ في التسجيل",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم إنشاء الحساب!",
        description: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني",
      });
    }
    
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border border-blue-200/50 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            مرحباً بك في AdImpact
          </CardTitle>
          <CardDescription className="text-slate-600">
            منصة الإعلانات التفاعلية المدعومة بالتكنولوجيا
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-700"
              >
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-700"
              >
                إنشاء حساب
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">كلمة المرور</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  تسجيل الدخول
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700 font-medium">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 font-medium">اسم المستخدم</Label>
                  <Input
                    id="username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="اختر اسم مستخدم"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">كلمة المرور</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="اختر كلمة مرور قوية"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  إنشاء حساب
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}