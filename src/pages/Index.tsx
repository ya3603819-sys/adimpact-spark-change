import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { 
  PlusCircle, 
  Users, 
  TrendingUp, 
  Zap, 
  Heart, 
  MessageCircle, 
  Eye, 
  BarChart3,
  Target,
  Rocket
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 floating-particles">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-accent/5 morphing-blob"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-brand-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-brand-accent/20 to-primary/20 rounded-full blur-xl"></div>
        <div className="relative z-10 container mx-auto max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 font-amiri">
            <span className="gradient-text-dynamic neon-glow">منصة الإعلانات</span>
            <br />
            <span className="text-foreground gradient-text block mt-4">المؤثرة 🚀</span>
          </h1>
          <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed font-cairo">
            ✨ اكتشف قوة الإعلانات الاجتماعية التي تحدث تأثيراً حقيقياً في المجتمع 
            <br />
            🌟 انضم لمجتمع من المبدعين والمؤثرين لنشر رسائل إيجابية ومعنوية
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button asChild size="lg" className="btn-glow text-xl px-12 py-4 font-cairo font-semibold">
              <Link to="/create">🎨 ابدأ الإبداع الآن</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-xl px-12 py-4 glass-effect hover:glass-card font-cairo font-semibold">
              <Link to="/ads">🌟 استكشف الإعلانات</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2 gradient-text">هدف واضح</h3>
              <p className="text-muted-foreground">رسائل مؤثرة تصل للقلوب</p>
            </div>
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-lg mb-2 gradient-text">مجتمع فعال</h3>
              <p className="text-muted-foreground">تفاعل وتشارك مع المبدعين</p>
            </div>
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-bold text-lg mb-2 gradient-text">تأثير حقيقي</h3>
              <p className="text-muted-foreground">قياس نتائج ملموسة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-brand-secondary/5 to-brand-accent/5"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text-dynamic font-amiri">
            📊 إحصائيات مذهلة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center tech-card card-hover">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🎯</div>
                <div className="text-4xl font-bold gradient-text mb-3 font-cairo">{stats.total_ads}</div>
                <div className="text-muted-foreground font-semibold">إعلان مؤثر</div>
              </CardContent>
            </Card>
            <Card className="text-center tech-card card-hover">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">👥</div>
                <div className="text-4xl font-bold gradient-text mb-3 font-cairo">{stats.total_likes}</div>
                <div className="text-muted-foreground font-semibold">إعجاب</div>
              </CardContent>
            </Card>
            <Card className="text-center tech-card card-hover">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">❤️</div>
                <div className="text-4xl font-bold gradient-text mb-3 font-cairo">{stats.total_comments}</div>
                <div className="text-muted-foreground font-semibold">تعليق</div>
              </CardContent>
            </Card>
            <Card className="text-center tech-card card-hover">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">👁️</div>
                <div className="text-4xl font-bold gradient-text mb-3 font-cairo">{stats.total_views}</div>
                <div className="text-muted-foreground font-semibold">مشاهدة</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-secondary/5"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text-dynamic font-amiri">
            🌟 ميزات المنصة الساحرة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="card-hover tech-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl gradient-text font-cairo">⚡ إنشاء سريع</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  أدوات بسيطة وقوية لإنشاء إعلانات مؤثرة في دقائق معدودة مع قوالب احترافية
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover tech-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-secondary/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="h-8 w-8 text-brand-secondary" />
                </div>
                <CardTitle className="text-2xl gradient-text font-cairo">🤝 مجتمع تفاعلي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  تفاعل مع المبدعين الآخرين وشاركهم التعليقات والإعجابات في بيئة إيجابية
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover tech-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="h-8 w-8 text-brand-accent" />
                </div>
                <CardTitle className="text-2xl gradient-text font-cairo">📊 تحليلات متقدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  اعرف مدى تأثير إعلاناتك من خلال إحصائيات مفصلة ودقيقة وتقارير شاملة
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover tech-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-success/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-brand-success/20 to-brand-success/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="h-8 w-8 text-brand-success" />
                </div>
                <CardTitle className="text-2xl gradient-text font-cairo">🎯 استهداف ذكي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  وصل لجمهورك المناسب من خلال خوارزميات ذكية للاستهداف والانتشار
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover tech-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl gradient-text font-cairo">💖 تأثير إيجابي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  شارك في نشر المحتوى الإيجابي والرسائل التي تبني المجتمع وتنشر الخير
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover tech-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-secondary/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Rocket className="h-8 w-8 text-brand-secondary" />
                </div>
                <CardTitle className="text-2xl gradient-text font-cairo">🚀 نمو مستمر</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  ميزات جديدة وأدوات متطورة تضاف باستمرار لتحسين تجربتك الإبداعية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-brand-accent/10 to-brand-secondary/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h2 className="text-6xl font-bold mb-8 gradient-text-dynamic font-amiri neon-glow">
            🌟 ابدأ رحلتك الإبداعية اليوم
          </h2>
          <p className="text-2xl text-muted-foreground mb-12 font-cairo leading-relaxed">
            ✨ انضم لآلاف المبدعين الذين يصنعون التغيير الإيجابي في المجتمع 
            <br />
            🚀 واترك بصمتك في عالم الإعلانات المؤثرة
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button asChild size="lg" className="btn-glow text-xl px-12 py-4 font-cairo font-bold">
              <Link to="/auth">🎯 انشئ حساباً مجانياً</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-xl px-12 py-4 glass-effect hover:glass-card font-cairo font-bold">
              <Link to="/leaderboard">🏆 شاهد المتصدرين</Link>
            </Button>
          </div>
          <div className="glass-card p-8 rounded-3xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold gradient-text mb-4 font-cairo">💎 ميزات حصرية للأعضاء</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🎨</div>
                <div className="font-semibold">قوالب احترافية</div>
              </div>
              <div>
                <div className="text-3xl mb-2">📱</div>
                <div className="font-semibold">مشاركة فورية</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🏅</div>
                <div className="font-semibold">نظام نقاط</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;