import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MessageCircle, Eye, Search, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Ad {
  id: string;
  title: string;
  description: string;
  content: any;
  template_id: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
    username: string;
  } | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
    username: string;
  };
}

export default function Ads() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAd, setSelectedAd] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [likedAds, setLikedAds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAds();
    if (user) {
      fetchUserLikes();
    }
  }, [user]);

  useEffect(() => {
    // Real-time subscription for new ads
    const adsChannel = supabase
      .channel('ads-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ads'
      }, (payload) => {
        fetchAds();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ads'
      }, (payload) => {
        fetchAds();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(adsChannel);
    };
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          *,
          profiles (
            full_name,
            username
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الإعلانات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('ad_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      const likedAdIds = new Set(data?.map(like => like.ad_id) || []);
      setLikedAds(likedAdIds);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const fetchComments = async (adId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            full_name,
            username
          )
        `)
        .eq('ad_id', adId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(prev => ({ ...prev, [adId]: data || [] }));
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل التعليقات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLike = async (adId: string) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يجب تسجيل الدخول أولاً للإعجاب بالإعلانات",
        variant: "destructive",
      });
      return;
    }

    try {
      if (likedAds.has(adId)) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('ad_id', adId);

        if (error) throw error;
        setLikedAds(prev => {
          const newSet = new Set(prev);
          newSet.delete(adId);
          return newSet;
        });
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, ad_id: adId });

        if (error) throw error;
        setLikedAds(prev => new Set([...prev, adId]));
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleComment = async (adId: string) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يجب تسجيل الدخول أولاً للتعليق",
        variant: "destructive",
      });
      return;
    }

    const comment = newComment[adId]?.trim();
    if (!comment) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          ad_id: adId,
          content: comment
        });

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [adId]: '' }));
      fetchComments(adId);
      
      toast({
        title: "تم إضافة التعليق",
        description: "تم نشر تعليقك بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة التعليق",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const incrementViews = async (adId: string) => {
    try {
      await supabase
        .from('ads')
        .update({ views_count: ads.find(ad => ad.id === adId)?.views_count + 1 })
        .eq('id', adId);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleToggleComments = (adId: string) => {
    if (selectedAd === adId) {
      setSelectedAd(null);
    } else {
      setSelectedAd(adId);
      incrementViews(adId);
      if (!comments[adId]) {
        fetchComments(adId);
      }
    }
  };

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الإعلانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">استكشف الإعلانات</h1>
          <p className="text-muted-foreground mb-6">
            اكتشف الإعلانات المؤثرة التي ينشرها مجتمعنا
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="ابحث في الإعلانات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredAds.map((ad) => (
            <Card key={ad.id} className="overflow-hidden card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      بواسطة {ad.profiles?.full_name || 'مستخدم'} • 
                      {formatDistanceToNow(new Date(ad.created_at), { 
                        addSuffix: true, 
                        locale: ar 
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div 
                  className="rounded-lg p-6 mb-4"
                  style={{ 
                    backgroundColor: ad.content.backgroundColor || '#8B5CF6',
                    color: ad.content.textColor || '#FFFFFF'
                  }}
                >
                  {ad.content.imageUrl && (
                    <img 
                      src={ad.content.imageUrl} 
                      alt={ad.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <p className="text-lg leading-relaxed">
                    {ad.content.text}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(ad.id)}
                      className={`flex items-center space-x-2 ${
                        likedAds.has(ad.id) ? 'text-brand-secondary' : 'text-muted-foreground'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedAds.has(ad.id) ? 'fill-current' : ''}`} />
                      <span>{ad.likes_count}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleComments(ad.id)}
                      className="flex items-center space-x-2 text-muted-foreground"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{ad.comments_count}</span>
                    </Button>
                    
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{ad.views_count}</span>
                    </div>
                  </div>
                </div>

                {selectedAd === ad.id && (
                  <div className="border-t pt-4">
                    {user && (
                      <div className="flex space-x-2 mb-4">
                        <Textarea
                          placeholder="اكتب تعليقاً..."
                          value={newComment[ad.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ 
                            ...prev, 
                            [ad.id]: e.target.value 
                          }))}
                          className="min-h-20"
                        />
                        <Button
                          onClick={() => handleComment(ad.id)}
                          size="sm"
                          className="self-end"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {comments[ad.id]?.map((comment) => (
                        <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">
                              {comment.profiles?.full_name || 'مستخدم'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { 
                                addSuffix: true, 
                                locale: ar 
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredAds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm ? 'لم يتم العثور على إعلانات مطابقة' : 'لا توجد إعلانات منشورة بعد'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}