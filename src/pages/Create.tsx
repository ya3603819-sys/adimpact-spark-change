import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Palette, Image, Video, Type } from 'lucide-react';

const templates = [
  {
    id: 'environmental',
    name: 'البيئة والاستدامة',
    description: 'قالب مخصص للحملات البيئية والتوعية',
    color: 'bg-brand-success',
    icon: '🌱'
  },
  {
    id: 'social',
    name: 'التوعية الاجتماعية',
    description: 'قالب للقضايا الاجتماعية والإنسانية',
    color: 'bg-brand-secondary',
    icon: '🤝'
  },
  {
    id: 'education',
    name: 'التعليم والتطوير',
    description: 'قالب للحملات التعليمية والثقافية',
    color: 'bg-brand-primary',
    icon: '📚'
  },
  {
    id: 'health',
    name: 'الصحة والعافية',
    description: 'قالب للتوعية الصحية والطبية',
    color: 'bg-brand-warning',
    icon: '💊'
  }
];

export default function Create() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: {
      text: '',
      imageUrl: '',
      videoUrl: '',
      backgroundColor: '#8B5CF6',
      textColor: '#FFFFFF'
    }
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('content.')) {
      const contentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [contentField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) {
      toast({
        title: "يرجى اختيار قالب",
        description: "يجب اختيار قالب تصميم قبل النشر",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          content: formData.content,
          template_id: selectedTemplate,
          status: 'published'
        });

      if (error) throw error;

      toast({
        title: "تم نشر الإعلان!",
        description: "تم نشر إعلانك بنجاح ويمكن للجميع رؤيته الآن",
      });

      navigate('/ads');
    } catch (error: any) {
      toast({
        title: "خطأ في النشر",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">إنشاء إعلان جديد</h1>
          <p className="text-muted-foreground">
            أنشئ إعلاناً مؤثراً لنشر رسالة إيجابية في المجتمع
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="h-5 w-5" />
                <span>محتوى الإعلان</span>
              </CardTitle>
              <CardDescription>أدخل تفاصيل إعلانك هنا</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الإعلان</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="أدخل عنواناً جذاباً لإعلانك"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">وصف مختصر</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="وصف مختصر للهدف من الإعلان"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content.text">النص الرئيسي</Label>
                  <Textarea
                    id="content.text"
                    name="content.text"
                    required
                    value={formData.content.text}
                    onChange={handleInputChange}
                    placeholder="اكتب رسالتك المؤثرة هنا..."
                    className="min-h-32"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content.imageUrl" className="flex items-center space-x-2">
                      <Image className="h-4 w-4" />
                      <span>رابط الصورة</span>
                    </Label>
                    <Input
                      id="content.imageUrl"
                      name="content.imageUrl"
                      type="url"
                      value={formData.content.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content.videoUrl" className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>رابط الفيديو</span>
                    </Label>
                    <Input
                      id="content.videoUrl"
                      name="content.videoUrl"
                      type="url"
                      value={formData.content.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content.backgroundColor">لون الخلفية</Label>
                    <Input
                      id="content.backgroundColor"
                      name="content.backgroundColor"
                      type="color"
                      value={formData.content.backgroundColor}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content.textColor">لون النص</Label>
                    <Input
                      id="content.textColor"
                      name="content.textColor"
                      type="color"
                      value={formData.content.textColor}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-glow"
                  disabled={loading || !selectedTemplate}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  نشر الإعلان
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Templates & Preview */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>اختر قالب التصميم</span>
                </CardTitle>
                <CardDescription>اختر القالب المناسب لنوع حملتك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate === template.id
                          ? 'border-brand-primary bg-brand-primary/10'
                          : 'border-border hover:border-brand-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{template.icon}</div>
                      <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>معاينة الإعلان</CardTitle>
                <CardDescription>هكذا سيظهر إعلانك للمستخدمين</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="rounded-lg p-6 min-h-64 flex flex-col justify-center"
                  style={{ 
                    backgroundColor: formData.content.backgroundColor,
                    color: formData.content.textColor 
                  }}
                >
                  {formData.content.imageUrl && (
                    <img 
                      src={formData.content.imageUrl} 
                      alt="معاينة الصورة"
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <h3 className="text-xl font-bold mb-2">
                    {formData.title || 'عنوان الإعلان'}
                  </h3>
                  
                  <p className="text-sm mb-4">
                    {formData.content.text || 'النص الرئيسي للإعلان سيظهر هنا...'}
                  </p>
                  
                  {selectedTemplate && (
                    <div className="text-xs opacity-75">
                      القالب: {templates.find(t => t.id === selectedTemplate)?.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}