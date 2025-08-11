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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
              AdImpact
            </h1>
            <p className="mb-4 text-2xl font-semibold text-white/90 md:text-3xl">
              Design for Change – قوة الإعلان
            </p>
            <p className="mb-8 text-lg text-white/80 md:text-xl max-w-2xl mx-auto">
              منصة تفاعلية تسخر قوة الإعلان والتصميم لإحداث تغيير إيجابي في المجتمع. 
              أنشئ إعلانات هادفة وشارك في بناء مستقبل أفضل.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="btn-glow bg-white text-brand-primary hover:bg-white/90">
                    <Link to="/create" className="flex items-center space-x-2">
                      <PlusCircle className="h-5 w-5" />
                      <span>إنشاء إعلان جديد</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Link to="/ads" className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>استكشف الإعلانات</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="btn-glow bg-white text-brand-primary hover:bg-white/90">
                  <Link to="/auth">ابدأ رحلتك الآن</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-lg bg-brand-primary/10">
                  <Zap className="h-6 w-6 text-brand-primary" />
                </div>
                <p className="text-2xl font-bold">{stats.total_ads}</p>
                <p className="text-sm text-muted-foreground">إعلان منشور</p>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-lg bg-brand-secondary/10">
                  <Heart className="h-6 w-6 text-brand-secondary" />
                </div>
                <p className="text-2xl font-bold">{stats.total_likes}</p>
                <p className="text-sm text-muted-foreground">إعجاب</p>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-lg bg-brand-accent/10">
                  <MessageCircle className="h-6 w-6 text-brand-accent" />
                </div>
                <p className="text-2xl font-bold">{stats.total_comments}</p>
                <p className="text-sm text-muted-foreground">تعليق</p>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-lg bg-brand-success/10">
                  <Eye className="h-6 w-6 text-brand-success" />
                </div>
                <p className="text-2xl font-bold">{stats.total_views}</p>
                <p className="text-sm text-muted-foreground">مشاهدة</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 gradient-text">لماذا AdImpact؟</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر لك الأدوات والإمكانيات لإنشاء إعلانات مؤثرة تحدث فرقاً حقيقياً
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center card-hover">
              <CardContent className="pt-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <PlusCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">إنشاء سهل</h3>
                <p className="text-muted-foreground">
                  قوالب تصميم جاهزة وأدوات بسيطة لإنشاء إعلانات احترافية في دقائق
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">تفاعل فوري</h3>
                <p className="text-muted-foreground">
                  شارك مع المجتمع في الوقت الفعلي واحصل على ردود فعل فورية
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">تأثير قابل للقياس</h3>
                <p className="text-muted-foreground">
                  تابع أداء إعلاناتك وقس تأثيرها الحقيقي على الجمهور
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              جاهز لتبدأ في إحداث التغيير؟
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              انضم إلى مجتمع المبدعين واستخدم قوة الإعلان لبناء عالم أفضل
            </p>
            <Button asChild size="lg" className="btn-glow bg-white text-brand-primary hover:bg-white/90">
              <Link to="/auth">إنشاء حساب مجاني</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
