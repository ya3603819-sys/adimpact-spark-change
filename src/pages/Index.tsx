import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { PlusCircle, Users, TrendingUp, Zap, Heart, MessageCircle, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdStats {
  total_ads: number;
  total_likes: number;
  total_comments: number;
  total_views: number;
}

const Index = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdStats>({
    total_ads: 0,
    total_likes: 0,
    total_comments: 0,
    total_views: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: adsData } = await supabase
        .from('ads')
        .select('likes_count, comments_count, views_count');
      
      if (adsData) {
        const totalLikes = adsData.reduce((sum, ad) => sum + (ad.likes_count || 0), 0);
        const totalComments = adsData.reduce((sum, ad) => sum + (ad.comments_count || 0), 0);
        const totalViews = adsData.reduce((sum, ad) => sum + (ad.views_count || 0), 0);
        
        setStats({
          total_ads: adsData.length,
          total_likes: totalLikes,
          total_comments: totalComments,
          total_views: totalViews,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0">
          {/* Subtle animated background */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold text-white">AI</span>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="mb-6 text-6xl font-bold text-white md:text-8xl tracking-tight">
              AdImpact
            </h1>
            
            {/* Subtitle with gradient */}
            <div className="mb-4">
              <span className="text-2xl font-semibold text-blue-200 md:text-4xl">Design for Change</span>
              <span className="text-2xl font-semibold text-white md:text-4xl"> – </span>
              <span className="text-2xl font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent md:text-4xl">قوة الإعلان</span>
            </div>
            
            {/* Description */}
            <p className="mb-12 text-lg text-blue-100 md:text-xl max-w-3xl mx-auto leading-relaxed">
              منصة تفاعلية مدعومة بالذكاء الاصطناعي لإنشاء إعلانات هادفة وقياس تأثيرها الإيجابي في المجتمع
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 btn-glow">
                    <Link to="/create" className="flex items-center space-x-3">
                      <PlusCircle className="h-6 w-6" />
                      <span>إنشاء إعلان جديد</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 text-lg">
                    <Link to="/ads" className="flex items-center space-x-3">
                      <Users className="h-6 w-6" />
                      <span>استكشف الإعلانات</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 btn-glow">
                  <Link to="/auth">ابدأ رحلتك الآن</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center tech-card p-6 rounded-2xl card-hover">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total_ads}</p>
              <p className="text-sm font-medium text-gray-600">إعلان منشور</p>
            </div>
            
            <div className="text-center tech-card p-6 rounded-2xl card-hover">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total_likes}</p>
              <p className="text-sm font-medium text-gray-600">إعجاب</p>
            </div>
            
            <div className="text-center tech-card p-6 rounded-2xl card-hover">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total_comments}</p>
              <p className="text-sm font-medium text-gray-600">تعليق</p>
            </div>
            
            <div className="text-center tech-card p-6 rounded-2xl card-hover">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total_views}</p>
              <p className="text-sm font-medium text-gray-600">مشاهدة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="gradient-text">لماذا AdImpact؟</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نوفر لك أحدث التقنيات والإمكانيات لإنشاء إعلانات مؤثرة تحدث فرقاً حقيقياً في المجتمع
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center tech-card p-8 rounded-3xl card-hover">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
                <PlusCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">إنشاء سهل وذكي</h3>
              <p className="text-gray-600 leading-relaxed">
                قوالب تصميم مدعومة بالذكاء الاصطناعي وأدوات بسيطة لإنشاء إعلانات احترافية في دقائق
              </p>
            </div>
            
            <div className="text-center tech-card p-8 rounded-3xl card-hover">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">تفاعل فوري</h3>
              <p className="text-gray-600 leading-relaxed">
                شارك مع المجتمع في الوقت الفعلي واحصل على ردود فعل فورية وتحليلات ذكية
              </p>
            </div>
            
            <div className="text-center tech-card p-8 rounded-3xl card-hover">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">تأثير قابل للقياس</h3>
              <p className="text-gray-600 leading-relaxed">
                تابع أداء إعلاناتك بتحليلات متقدمة وقس تأثيرها الحقيقي على الجمهور
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              جاهز لتبدأ في إحداث التغيير؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى مجتمع المبدعين واستخدم قوة الإعلان والتكنولوجيا لبناء عالم أفضل
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link to="/auth">إنشاء حساب مجاني</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
