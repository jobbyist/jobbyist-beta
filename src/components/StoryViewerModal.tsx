import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Story {
  id: string;
  title: string;
  image: string;
}

interface StoryViewerModalProps {
  story: Story;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const StoryViewerModal = ({ 
  story, 
  onClose, 
  onNext, 
  onPrev, 
  hasNext, 
  hasPrev 
}: StoryViewerModalProps) => {
  const [progress, setProgress] = useState(0);

  // Auto-advance to next story after 5 seconds
  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);

      if (elapsed >= duration) {
        if (hasNext) {
          onNext();
          setProgress(0);
        } else {
          onClose();
        }
      }
    }, interval);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, [story.id, hasNext, onNext, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrev, onNext, onPrev, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Previous Button */}
      {hasPrev && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {/* Next Button */}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Story Container */}
      <div className="relative max-w-md w-full h-[90vh] max-h-[800px] mx-auto">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Story Title */}
        <div className="absolute top-8 left-0 right-0 z-10 px-4">
          <h2 className="text-white text-xl font-bold text-center drop-shadow-lg">
            {story.title}
          </h2>
        </div>

        {/* Story Image */}
        <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
            <p className="text-sm opacity-90">
              Discover the latest updates and insights about {story.title.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
