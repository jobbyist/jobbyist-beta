import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Story {
  id: string;
  title: string;
  image: string;
  thumbnail: string;
}

const stories: Story[] = [
  {
    id: '1',
    title: 'Courses',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '2',
    title: 'Events',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '3',
    title: 'Trending',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '4',
    title: 'Updates',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '5',
    title: 'Reviews',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '6',
    title: 'Workshops',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '7',
    title: 'Community',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '8',
    title: 'Promotions',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '9',
    title: 'Affiliates',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
  {
    id: '10',
    title: 'Giveaways',
    thumbnail: 'https://www.imghippo.com/i/YZkm8301xYA.png',
    image: 'https://www.imghippo.com/i/YZkm8301xYA.png',
  },
];

export const Stories = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const handlePrevStory = () => {
    setCurrentStoryIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
  };

  const handleModalPrev = () => {
    if (selectedStory) {
      const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
      const prevIndex = currentIndex === 0 ? stories.length - 1 : currentIndex - 1;
      setSelectedStory(stories[prevIndex]);
    }
  };

  const handleModalNext = () => {
    if (selectedStory) {
      const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
      const nextIndex = (currentIndex + 1) % stories.length;
      setSelectedStory(stories[nextIndex]);
    }
  };

  // Calculate visible stories (show 6 at a time, scrolling horizontally)
  const visibleCount = 6;
  const getVisibleStories = () => {
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(stories[(currentStoryIndex + i) % stories.length]);
    }
    return visible;
  };

  const visibleStories = getVisibleStories();

  return (
    <>
      {/* Stories Carousel */}
      <div className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="relative flex items-center gap-4">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevStory}
              className="absolute -left-2 z-10 h-8 w-8 rounded-full bg-background shadow-md hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Stories Container */}
            <div className="flex gap-3 overflow-hidden px-8 w-full">
              {visibleStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => handleStoryClick(story)}
                  className="flex flex-col items-center gap-1 flex-shrink-0 group"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary via-purple-500 to-pink-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-background p-0.5">
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground truncate max-w-[64px] group-hover:text-primary transition-colors">
                    {story.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextStory}
              className="absolute -right-2 z-10 h-8 w-8 rounded-full bg-background shadow-md hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-0 bg-black border-none">
          <div className="relative w-full aspect-[9/16] bg-black">
            {selectedStory && (
              <>
                {/* Story Image */}
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-contain"
                />

                {/* Story Title Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg drop-shadow-lg">
                    {selectedStory.title}
                  </h3>
                </div>

                {/* Navigation Buttons */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleModalPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleModalNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
