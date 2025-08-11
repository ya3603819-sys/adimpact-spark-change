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
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-8">
            {/* Logo */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
              <span className="text-2xl font-bold text-white">AI</span>
            </div>
            
            <CardTitle className="text-3xl font-bold gradient-text mb-2">
              مرحباً بك في AdImpact
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              منصة الإعلانات التفاعلية المدعومة بالتكنولوجيا
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-700 font-medium rounded-lg py-2.5 transition-all"
                >
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-700 font-medium rounded-lg py-2.5 transition-all"
                >
                  إنشاء حساب
                </TabsTrigger>
              </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">كلمة المرور</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl"
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  تسجيل الدخول
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-semibold text-sm">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-semibold text-sm">اسم المستخدم</Label>
                  <Input
                    id="username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl"
                    placeholder="اختر اسم مستخدم"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">كلمة المرور</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl"
                    placeholder="اختر كلمة مرور قوية"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
    </div>
  );
}