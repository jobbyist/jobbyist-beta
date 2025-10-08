import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Story {
  id: number;
  title: string;
  gradient: string;
}

const stories: Story[] = [
  { id: 1, title: 'Courses', gradient: 'from-purple-500 to-pink-500' },
  { id: 2, title: 'Events', gradient: 'from-blue-500 to-cyan-500' },
  { id: 3, title: 'Trending', gradient: 'from-red-500 to-orange-500' },
  { id: 4, title: 'Updates', gradient: 'from-green-500 to-emerald-500' },
  { id: 5, title: 'Sponsored', gradient: 'from-yellow-500 to-amber-500' },
  { id: 6, title: 'Workshops', gradient: 'from-indigo-500 to-purple-500' },
  { id: 7, title: 'Community', gradient: 'from-pink-500 to-rose-500' },
  { id: 8, title: 'Exclusives', gradient: 'from-teal-500 to-cyan-500' },
  { id: 9, title: 'Affiliates', gradient: 'from-orange-500 to-red-500' },
  { id: 10, title: 'Giveaways', gradient: 'from-violet-500 to-purple-500' },
];

export const StoriesHighlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const storiesPerView = 7; // Number of stories visible at once

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // Loop back to start when we reach the end
        if (nextIndex >= stories.length - storiesPerView + 1) {
          return 0;
        }
        return nextIndex;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= stories.length - storiesPerView + 1) {
        return 0;
      }
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return Math.max(0, stories.length - storiesPerView);
      }
      return prev - 1;
    });
  };

  const handleStoryClick = (story: Story) => {
    setIsAutoPlaying(false);
    console.log('Story clicked:', story.title);
    // Here you can add logic to show story content
  };

  const visibleStories = stories.slice(currentIndex, currentIndex + storiesPerView);

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="relative flex items-center justify-center gap-3">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="h-8 w-8 shrink-0"
            aria-label="Previous stories"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Stories Container */}
          <div className="flex gap-4 overflow-hidden flex-1 justify-center">
            {visibleStories.map((story) => (
              <button
                key={story.id}
                onClick={() => handleStoryClick(story)}
                className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-105"
                aria-label={`View ${story.title} story`}
              >
                {/* Story Circle */}
                <div className="relative">
                  {/* Gradient Ring */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.gradient} p-0.5 animate-pulse`}>
                    {/* Inner Circle */}
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      {/* Content Circle */}
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center text-white font-bold text-xs`}>
                        {story.title.substring(0, 1)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Title */}
                <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground max-w-[64px] truncate">
                  {story.title}
                </span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= stories.length - storiesPerView}
            className="h-8 w-8 shrink-0"
            aria-label="Next stories"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: Math.ceil(stories.length / storiesPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index * storiesPerView);
              }}
              className={`h-1 rounded-full transition-all ${
                Math.floor(currentIndex / storiesPerView) === index
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to story set ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
