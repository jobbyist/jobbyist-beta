import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card, CardContent } from './ui/card';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  Rewind, 
  FastForward,
  Download,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Eye
} from 'lucide-react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface AudioEpisode {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail?: string;
  audioUrl: string;
  duration: number;
  initialPlayCount: number;
}

interface AudioPlayerProps {
  episodes: AudioEpisode[];
  currentEpisodeIndex?: number;
  onEpisodeChange?: (index: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  episodes, 
  currentEpisodeIndex = 0, 
  onEpisodeChange 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [playCount, setPlayCount] = useState(episodes[currentEpisodeIndex]?.initialPlayCount || 2500);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentEpisode = episodes[currentEpisodeIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentEpisodeIndex < episodes.length - 1) {
        onEpisodeChange?.(currentEpisodeIndex + 1);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, playbackRate, currentEpisodeIndex, episodes.length, onEpisodeChange]);

  useEffect(() => {
    setPlayCount(episodes[currentEpisodeIndex]?.initialPlayCount || 2500);
    setIsLiked(false);
    setIsDisliked(false);
  }, [currentEpisodeIndex, episodes]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      if (currentTime === 0) {
        setPlayCount(prev => prev + 1);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (value[0] / 100) * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const changeSpeed = (newRate: number) => {
    setPlaybackRate(newRate);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
  };

  const handlePreviousEpisode = () => {
    if (currentEpisodeIndex > 0) {
      onEpisodeChange?.(currentEpisodeIndex - 1);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      onEpisodeChange?.(currentEpisodeIndex + 1);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const downloadForOffline = () => {
    // Store in localStorage for offline access
    const offlineEpisodes = JSON.parse(localStorage.getItem('offlineEpisodes') || '[]');
    const episodeData = {
      ...currentEpisode,
      downloadedAt: new Date().toISOString()
    };
    
    if (!offlineEpisodes.find((ep: any) => ep.id === currentEpisode.id)) {
      offlineEpisodes.push(episodeData);
      localStorage.setItem('offlineEpisodes', JSON.stringify(offlineEpisodes));
      alert('Episode saved for offline listening!');
    } else {
      alert('Episode already saved for offline listening!');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        {/* Episode Info */}
        <div className="flex gap-4 mb-6">
          {currentEpisode.thumbnail && (
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex-shrink-0">
              <img 
                src={currentEpisode.thumbnail} 
                alt={currentEpisode.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{currentEpisode.title}</h3>
            <p className="text-muted-foreground text-sm mb-2">{currentEpisode.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{currentEpisode.date}</span>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{playCount.toLocaleString()} plays</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={currentEpisode.audioUrl}
          preload="metadata"
        />

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[audioRef.current ? (currentTime / audioRef.current.duration) * 100 : 0]}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioRef.current?.duration || 0)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousEpisode}
            disabled={currentEpisodeIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => skipTime(-10)}>
            <Rewind className="h-4 w-4" />
          </Button>
          
          <Button onClick={togglePlay} size="lg" className="rounded-full w-12 h-12">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => skipTime(10)}>
            <FastForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextEpisode}
            disabled={currentEpisodeIndex === episodes.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Secondary Controls - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            
            <Button
              variant={isDisliked ? "destructive" : "ghost"}
              size="sm"
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={downloadForOffline}>
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTipDialog(!showTipDialog)}
              className="text-green-600 hover:text-green-700"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PayPal Tip Dialog */}
        {showTipDialog && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Support the Podcast</h4>
            <PayPalScriptProvider options={{ 
              clientId: "your-paypal-client-id",
              currency: "USD"
            }}>
              <PayPalButtons
                style={{ layout: "horizontal" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [{
                      amount: {
                        currency_code: "USD",
                        value: "5.00"
                      }
                    }]
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order!.capture().then(() => {
                    alert("Thank you for your support!");
                    setShowTipDialog(false);
                  });
                }}
              />
            </PayPalScriptProvider>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTipDialog(false)}
              className="w-full mt-2"
            >
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};