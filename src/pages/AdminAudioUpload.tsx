import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Upload, ArrowLeft, Music, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface UploadFormData {
  title: string;
  description: string;
  audioFile: FileList;
  thumbnailFile: FileList;
}

interface UploadProgress {
  audio: number;
  thumbnail: number;
}

const AdminAudioUpload = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ audio: 0, thumbnail: 0 });
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<UploadFormData>();

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setIsAdmin(data?.is_admin || false);
        
        if (!data?.is_admin) {
          toast({
            title: "Access Denied",
            description: "You need admin privileges to access this page",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    if (!loading && user) {
      checkAdminStatus();
    } else if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate, toast]);

  // Get audio duration when file is selected
  const audioFile = watch('audioFile');
  useEffect(() => {
    if (audioFile && audioFile[0]) {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.floor(audio.duration));
      };
      audio.src = URL.createObjectURL(audioFile[0]);
    }
  }, [audioFile]);

  const uploadFile = async (
    file: File,
    bucket: string,
    folder: string,
    onProgress: (progress: number) => void
  ) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Simulate progress for UI feedback
    onProgress(50);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    
    // Complete progress
    onProgress(100);
    return data.path;
  };

  const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!data.audioFile[0] || !audioDuration) {
      toast({
        title: "Error",
        description: "Please select an audio file and wait for it to load",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress({ audio: 0, thumbnail: 0 });

    try {
      // Upload audio file
      const audioPath = await uploadFile(
        data.audioFile[0],
        'audio-episodes',
        'episodes',
        (progress) => setUploadProgress(prev => ({ ...prev, audio: progress }))
      );

      let thumbnailUrl = null;
      
      // Upload thumbnail if provided
      if (data.thumbnailFile && data.thumbnailFile[0]) {
        const thumbnailPath = await uploadFile(
          data.thumbnailFile[0],
          'episode-thumbnails',
          'thumbnails',
          (progress) => setUploadProgress(prev => ({ ...prev, thumbnail: progress }))
        );
        thumbnailUrl = getPublicUrl('episode-thumbnails', thumbnailPath);
      }

      // Get signed URL for audio file
      const { data: signedData, error: signedError } = await supabase.storage
        .from('audio-episodes')
        .createSignedUrl(audioPath, 60 * 60 * 24 * 365); // 1 year

      if (signedError) throw signedError;

      // Save episode to database
      const { error: dbError } = await supabase
        .from('audio_episodes')
        .insert({
          title: data.title,
          description: data.description || null,
          audio_url: signedData.signedUrl,
          thumbnail_url: thumbnailUrl,
          duration: audioDuration,
          play_count: 0
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Audio episode uploaded successfully!",
      });

      reset();
      setAudioDuration(null);
      setUploadProgress({ audio: 0, thumbnail: 0 });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen animated-gradient-bg animated-gradient-overlay">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Audio Upload</h1>
          <p className="text-muted-foreground">Upload new audio episodes for the podcast player</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Upload New Episode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Episode Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter episode title"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="text-destructive text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter episode description"
                  rows={4}
                  {...register('description')}
                />
              </div>

              {/* Audio File */}
              <div className="space-y-2">
                <Label htmlFor="audioFile">Audio File *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    {...register('audioFile', { required: 'Audio file is required' })}
                  />
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
                {audioDuration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Duration: {Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, '0')}
                  </div>
                )}
                {errors.audioFile && (
                  <p className="text-destructive text-sm">{errors.audioFile.message}</p>
                )}
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label htmlFor="thumbnailFile">Thumbnail Image (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    {...register('thumbnailFile')}
                  />
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Audio Upload</span>
                      <span>{Math.round(uploadProgress.audio)}%</span>
                    </div>
                    <Progress value={uploadProgress.audio} />
                  </div>
                  
                  {uploadProgress.thumbnail > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Thumbnail Upload</span>
                        <span>{Math.round(uploadProgress.thumbnail)}%</span>
                      </div>
                      <Progress value={uploadProgress.thumbnail} />
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={uploading || !audioDuration}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Episode
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAudioUpload;