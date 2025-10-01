import { useEffect, useState } from 'react';

interface PreloaderProps {
  onLoadingComplete?: () => void;
}

const Preloader = ({ onLoadingComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let contentLoaded = false;
    
    // Listen for window load event (when all content including images is loaded)
    const handleLoad = () => {
      contentLoaded = true;
    };
    
    if (document.readyState === 'complete') {
      contentLoaded = true;
    } else {
      window.addEventListener('load', handleLoad);
    }
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        // If content is loaded, rapidly complete the progress
        if (contentLoaded && prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onLoadingComplete?.();
          }, 300);
          return 100;
        }
        
        // Normal loading progress - slow down as we get closer to 90%
        const maxProgress = contentLoaded ? 100 : 90;
        if (prev >= maxProgress) {
          return prev;
        }
        
        const increment = contentLoaded ? 20 : Math.random() * 10 + 3;
        return Math.min(prev + increment, maxProgress);
      });
    }, 150);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-300"
      style={{ opacity: progress >= 100 ? 0 : 1 }}
    >
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <img 
          src="/JOBBYIST.svg" 
          alt="Jobbyist Logo" 
          className="h-32 w-32 md:h-40 md:w-40"
        />
      </div>

      {/* Loading Bar Container */}
      <div className="w-64 md:w-96 h-2 bg-muted rounded-full overflow-hidden">
        {/* Loading Bar */}
        <div 
          className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="h-full w-full relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Loading percentage */}
      <div className="mt-4 text-sm text-muted-foreground font-medium">
        {Math.round(progress)}%
      </div>

      {/* Loading text */}
      <div className="mt-2 text-xs text-muted-foreground">
        Loading your experience...
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
