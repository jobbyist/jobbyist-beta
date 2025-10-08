import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface Story {
  id: string;
  title: string;
  image: string;
  description: string;
  link: string;
  category: string;
}

const stories: Story[] = [
  {
    id: '1',
    title: 'Top 5 In-Demand Skills in South Africa for 2024',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    description: 'Discover the most sought-after skills that employers in South Africa are looking for.',
    link: '#',
    category: 'Career Tips',
  },
  {
    id: '2',
    title: 'How to Ace Your Virtual Interview in Nigeria',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    description: 'Master the art of virtual interviews with these proven strategies for Nigerian job seekers.',
    link: '#',
    category: 'Interview Tips',
  },
  {
    id: '3',
    title: 'Remote Work Opportunities Growing Across Africa',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    description: 'Explore the rise of remote work and how it\'s transforming the African job market.',
    link: '#',
    category: 'Trends',
  },
  {
    id: '4',
    title: 'Navigating Career Changes: A Guide for South Africans',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    description: 'Thinking of switching careers? Here\'s everything you need to know to make a successful transition.',
    link: '#',
    category: 'Career Growth',
  },
  {
    id: '5',
    title: 'Tech Jobs Boom in Lagos: What You Need to Know',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    description: 'Lagos is becoming Africa\'s tech hub. Learn about the opportunities available.',
    link: '#',
    category: 'Tech Careers',
  },
  {
    id: '6',
    title: 'Building a Strong Professional Network in Nigeria',
    image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=800&q=80',
    description: 'Networking tips specifically tailored for Nigerian professionals.',
    link: '#',
    category: 'Networking',
  },
  {
    id: '7',
    title: 'CV Writing Tips from South African Recruiters',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    description: 'Learn what recruiters really want to see in your CV.',
    link: '#',
    category: 'Job Application',
  },
  {
    id: '8',
    title: 'Graduate Programmes: Your Path to Success',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Everything you need to know about graduate programmes in South Africa and Nigeria.',
    link: '#',
    category: 'Entry Level',
  },
  {
    id: '9',
    title: 'Salary Negotiation Tips for African Professionals',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80',
    description: 'Get the salary you deserve with these proven negotiation strategies.',
    link: '#',
    category: 'Salary',
  },
  {
    id: '10',
    title: 'Work-Life Balance in the African Context',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    description: 'Maintaining wellness while building your career in South Africa and Nigeria.',
    link: '#',
    category: 'Wellness',
  },
];

export const LatestStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const storiesPerView = isMobile ? 1 : 3;

  const nextStories = () => {
    setCurrentIndex((prev) => 
      prev + storiesPerView >= stories.length ? 0 : prev + storiesPerView
    );
  };

  const prevStories = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, stories.length - storiesPerView) : Math.max(0, prev - storiesPerView)
    );
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + storiesPerView >= stories.length ? 0 : prev + storiesPerView
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [storiesPerView]);

  const visibleStories = stories.slice(currentIndex, currentIndex + storiesPerView);

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <TooltipProvider>
          <div className="text-center mb-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 cursor-help inline-block">
                  Community Forum
                </h2>
              </TooltipTrigger>
              <TooltipContent>
                <p>New content coming soon. Watch this space!</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Career insights, tips, and success stories for job seekers across Africa
            </p>
          </div>

        <div className="relative">
          {/* Navigation Buttons - More Visible */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prevStories}
              disabled={currentIndex === 0}
              className="pointer-events-auto -ml-4 shadow-xl bg-background hover:bg-background border-2 border-primary/30 hover:border-primary"
            >
              <ChevronLeft className="h-7 w-7 text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextStories}
              disabled={currentIndex + storiesPerView >= stories.length}
              className="pointer-events-auto -mr-4 shadow-xl bg-background hover:bg-background border-2 border-primary/30 hover:border-primary"
            >
              <ChevronRight className="h-7 w-7 text-primary" />
            </Button>
          </div>

          {/* Stories Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
            {visibleStories.map((story, index) => (
              <a
                key={story.id}
                href={story.link}
                className="group block"
                style={{
                  animation: `fadeIn 0.5s ease-in ${index * 0.1}s both`,
                }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        {story.category}
                      </span>
                    </div>

                    {/* Story Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-foreground transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-200 line-clamp-2 mb-3">
                        {story.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Read More</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(stories.length / storiesPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * storiesPerView)}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / storiesPerView) === index
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to story set ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </TooltipProvider>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
