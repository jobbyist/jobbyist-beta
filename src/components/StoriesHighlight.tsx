import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoryViewerModal } from './StoryViewerModal';

interface Story {
  id: string;
  title: string;
  image: string;
}

const stories: Story[] = [
  { id: '1', title: 'Courses', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '2', title: 'Events', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '3', title: 'Trending', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '4', title: 'Updates', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '5', title: 'Reviews', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '6', title: 'Workshops', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '7', title: 'Community', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '8', title: 'Promotions', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '9', title: 'Affiliates', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
  { id: '10', title: 'Giveaways', image: 'https://www.imghippo.com/i/YZkm8301xYA.png' },
];

export const StoriesHighlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const storiesPerView = 7; // Show 7 stories at once on desktop

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= stories.length - storiesPerView + 1 ? 0 : next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextStories = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next >= stories.length - storiesPerView + 1 ? 0 : next;
    });
  };

  const prevStories = () => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      return next < 0 ? Math.max(0, stories.length - storiesPerView) : next;
    });
  };

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(currentIndex + index);
  };

  const handleCloseModal = () => {
    setSelectedStoryIndex(null);
  };

  const handleNextStory = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    }
  };

  const handlePrevStory = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  const visibleStories = stories.slice(currentIndex, currentIndex + storiesPerView);

  return (
    <>
      <div className="bg-background/95 border-b py-4 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-center gap-4">
            {/* Previous Button */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={prevStories}
                className="absolute left-0 z-10 rounded-full bg-background/80 hover:bg-background shadow-md"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Stories Container */}
            <div className="flex gap-4 items-center overflow-hidden">
              {visibleStories.map((story, index) => (
                <div
                  key={story.id}
                  onClick={() => handleStoryClick(index)}
                  className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]"
                >
                  <div className="relative">
                    {/* Gradient border ring */}
                    <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-background p-[3px]">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground text-center line-clamp-1 max-w-[80px]">
                    {story.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Next Button */}
            {currentIndex < stories.length - storiesPerView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={nextStories}
                className="absolute right-0 z-10 rounded-full bg-background/80 hover:bg-background shadow-md"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          story={stories[selectedStoryIndex]}
          onClose={handleCloseModal}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
          hasNext={selectedStoryIndex < stories.length - 1}
          hasPrev={selectedStoryIndex > 0}
        />
      )}
    </>
  );
};
