import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

interface AudioEpisode {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  thumbnail_url?: string;
  duration?: number;
  play_count?: number;
  transcript?: string;
  created_at: string;
}

const Episodes = () => {
  const { user } = useAuth();
  const [audioEpisodes, setAudioEpisodes] = useState<AudioEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  useEffect(() => {
    const fetchAudioEpisodes = async () => {
      setLoadingEpisodes(true);
      try {
        const { data, error } = await supabase
          .from('audio_episodes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setAudioEpisodes(data || []);
      } catch (error) {
        console.error('Error fetching audio episodes:', error);
      } finally {
        setLoadingEpisodes(false);
      }
    };

    fetchAudioEpisodes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">The Job Post - All Episodes</h1>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Job Post Podcast
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Listen to expert advice, success stories, and practical tips to advance your career in the African job market. New episodes every weekday.
            </p>
          </div>

          {loadingEpisodes ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading episodes...</p>
            </div>
          ) : audioEpisodes && audioEpisodes.length > 0 ? (
            <>
              {/* Audio Player */}
              <div className="mb-12">
                <AudioPlayer 
                  episodes={audioEpisodes.map(episode => ({
                    id: episode.id,
                    title: episode.title,
                    description: episode.description || 'No description available',
                    date: new Date(episode.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }),
                    audioUrl: episode.audio_url,
                    duration: episode.duration || 0,
                    initialPlayCount: episode.play_count || 8769,
                    thumbnail: episode.thumbnail_url || null
                  }))}
                  currentEpisodeIndex={currentEpisodeIndex}
                  onEpisodeChange={setCurrentEpisodeIndex}
                />
              </div>

              {/* Episode List */}
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">All Episodes</h3>
                <div className="space-y-4">
                  {audioEpisodes.map((episode, index) => (
                    <div
                      key={episode.id}
                      className={`p-6 border rounded-lg cursor-pointer transition-all ${
                        index === currentEpisodeIndex
                          ? 'bg-primary/10 border-primary'
                          : 'bg-background hover:bg-muted/50'
                      }`}
                      onClick={() => setCurrentEpisodeIndex(index)}
                    >
                      <div className="flex gap-4">
                        {episode.thumbnail_url && (
                          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex-shrink-0">
                            <img 
                              src={episode.thumbnail_url} 
                              alt={episode.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{episode.title}</h4>
                          <p className="text-muted-foreground text-sm mb-2">
                            {episode.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {new Date(episode.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            {episode.duration && (
                              <span>
                                {Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Transcript (if available) */}
                      {episode.transcript && index === currentEpisodeIndex && (
                        <div className="mt-6 pt-6 border-t">
                          <h5 className="font-semibold mb-3">Transcript</h5>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {episode.transcript}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-background/50 border rounded-lg">
              <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">🎵</div>
              <h3 className="text-lg font-semibold mb-2">No episodes available</h3>
              <p className="text-muted-foreground">
                Audio episodes will appear here once uploaded by an admin.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Episodes;
