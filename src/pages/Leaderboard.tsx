import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Heart, MessageCircle, Eye, Crown, Medal, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeaderboardAd {
  id: string;
  title: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
    username: string;
  } | null;
}

interface TopCreator {
  user_id: string;
  full_name: string;
  username: string;
  total_ads: number;
  total_likes: number;
  total_comments: number;
  total_views: number;
}

export default function Leaderboard() {
  const { toast } = useToast();
  const [topAds, setTopAds] = useState<{
    likes: LeaderboardAd[];
    comments: LeaderboardAd[];
    views: LeaderboardAd[];
  }>({
    likes: [],
    comments: [],
    views: []
  });
  const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Fetch top ads by different metrics
      const [likesData, commentsData, viewsData] = await Promise.all([
        supabase
          .from('ads')
          .select('id, title, likes_count, comments_count, views_count, created_at, user_id')
          .eq('status', 'published')
          .order('likes_count', { ascending: false })
          .limit(10),
        
        supabase
          .from('ads')
          .select('id, title, likes_count, comments_count, views_count, created_at, user_id')
          .eq('status', 'published')
          .order('comments_count', { ascending: false })
          .limit(10),
          
        supabase
          .from('ads')
          .select('id, title, likes_count, comments_count, views_count, created_at, user_id')
          .eq('status', 'published')
          .order('views_count', { ascending: false })
          .limit(10)
      ]);

      // Get all unique user IDs
      const allUserIds = new Set([
        ...(likesData.data?.map(ad => ad.user_id) || []),
        ...(commentsData.data?.map(ad => ad.user_id) || []),
        ...(viewsData.data?.map(ad => ad.user_id) || [])
      ]);

      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, username')
        .in('user_id', Array.from(allUserIds));

      if (profilesError) throw profilesError;

      const profileMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      // Add profiles to ads
      const addProfilesToAds = (ads: any[]) => 
        ads.map(ad => ({
          ...ad,
          profiles: profileMap.get(ad.user_id) || null
        }));

      setTopAds({
        likes: addProfilesToAds(likesData.data || []),
        comments: addProfilesToAds(commentsData.data || []),
        views: addProfilesToAds(viewsData.data || [])
      });

      // Fetch top creators (aggregated data)
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('ads')
        .select('user_id, likes_count, comments_count, views_count')
        .eq('status', 'published');

      if (creatorsError) throw creatorsError;

      // Aggregate creator stats
      const creatorStats = new Map<string, TopCreator>();
      
      creatorsData?.forEach(ad => {
        const userId = ad.user_id;
        const profile = profileMap.get(userId);
        
        if (!creatorStats.has(userId)) {
          creatorStats.set(userId, {
            user_id: userId,
            full_name: profile?.full_name || 'مستخدم',
            username: profile?.username || '',
            total_ads: 0,
            total_likes: 0,
            total_comments: 0,
            total_views: 0
          });
        }
        
        const creator = creatorStats.get(userId)!;
        creator.total_ads += 1;
        creator.total_likes += ad.likes_count || 0;
        creator.total_comments += ad.comments_count || 0;
        creator.total_views += ad.views_count || 0;
      });

      // Sort creators by total engagement (likes + comments + views)
      const sortedCreators = Array.from(creatorStats.values())
        .sort((a, b) => {
          const aEngagement = a.total_likes + a.total_comments + a.total_views;
          const bEngagement = b.total_likes + b.total_comments + b.total_views;
          return bEngagement - aEngagement;
        })
        .slice(0, 10);

      setTopCreators(sortedCreators);

    } catch (error: any) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-primary" />;
      case 2:
        return <Medal className="h-6 w-6 text-brand-secondary" />;
      case 3:
        return <Award className="h-6 w-6 text-brand-accent" />;
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground";
      case 2:
        return "bg-gradient-to-r from-brand-secondary/90 to-brand-secondary text-white";
      case 3:
        return "bg-gradient-to-r from-brand-accent/90 to-brand-accent text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل المتصدرين...</p>
        </div>
      </div>
    );
  }

  const AdLeaderboardCard = ({ ads, metric, icon }: { 
    ads: LeaderboardAd[], 
    metric: 'likes' | 'comments' | 'views',
    icon: React.ReactNode 
  }) => (
    <div className="space-y-4">
      {ads.map((ad, index) => (
        <Card key={ad.id} className={`relative overflow-hidden card-hover tech-card ${index < 3 ? 'ring-2 ring-primary/30 shadow-lg' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(index + 1)} font-bold shadow-lg`}>
                {index < 3 ? getRankIcon(index + 1) : index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{ad.title}</h3>
                <p className="text-sm text-muted-foreground">
                  بواسطة {ad.profiles?.full_name || 'مستخدم'}
                </p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded-full">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">{ad.likes_count}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-full">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{ad.comments_count}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-brand-success bg-brand-success/10 px-2 py-1 rounded-full">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">{ad.views_count}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-1 text-brand-primary">
                  {icon}
                  <span className="text-2xl font-bold">
                    {metric === 'likes' ? ad.likes_count : 
                     metric === 'comments' ? ad.comments_count : 
                     ad.views_count}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">🏆 المتصدرون</h1>
          <p className="text-muted-foreground text-lg">
            اكتشف أكثر الإعلانات والمبدعين تأثيراً في المجتمع
          </p>
        </div>

        <Tabs defaultValue="creators" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 glass-effect">
            <TabsTrigger value="creators" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="h-4 w-4" />
              <span>أفضل المبدعين</span>
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center space-x-2 data-[state=active]:bg-brand-secondary data-[state=active]:text-white">
              <Heart className="h-4 w-4" />
              <span>الأكثر إعجاباً</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center space-x-2 data-[state=active]:bg-brand-accent data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4" />
              <span>الأكثر تعليقاً</span>
            </TabsTrigger>
            <TabsTrigger value="views" className="flex items-center space-x-2 data-[state=active]:bg-brand-success data-[state=active]:text-white">
              <Eye className="h-4 w-4" />
              <span>الأكثر مشاهدة</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="creators">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-brand-primary" />
                  <span>أفضل المبدعين</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCreators.map((creator, index) => (
                    <Card key={creator.user_id} className={`relative overflow-hidden ${index < 3 ? 'ring-2 ring-brand-primary/20' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(index + 1)} text-white font-bold`}>
                            {index < 3 ? getRankIcon(index + 1) : index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{creator.full_name}</h3>
                            <p className="text-sm text-muted-foreground">@{creator.username}</p>
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="secondary">{creator.total_ads} إعلان</Badge>
                              <div className="flex items-center space-x-1 text-brand-secondary">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm">{creator.total_likes}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-brand-accent">
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm">{creator.total_comments}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-brand-success">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">{creator.total_views}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-brand-primary">
                              {creator.total_likes + creator.total_comments + creator.total_views}
                            </div>
                            <div className="text-xs text-muted-foreground">إجمالي التفاعل</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="likes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-brand-secondary" />
                  <span>الإعلانات الأكثر إعجاباً</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdLeaderboardCard 
                  ads={topAds.likes} 
                  metric="likes" 
                  icon={<Heart className="h-6 w-6" />} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-brand-accent" />
                  <span>الإعلانات الأكثر تعليقاً</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdLeaderboardCard 
                  ads={topAds.comments} 
                  metric="comments" 
                  icon={<MessageCircle className="h-6 w-6" />} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="views">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-6 w-6 text-brand-success" />
                  <span>الإعلانات الأكثر مشاهدة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdLeaderboardCard 
                  ads={topAds.views} 
                  metric="views" 
                  icon={<Eye className="h-6 w-6" />} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}