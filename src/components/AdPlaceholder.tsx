import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  size: 'banner' | 'rectangle' | 'mobile' | 'skyscraper' | 'square';
  className?: string;
  label?: string;
}

const adSizes = {
  banner: { width: 728, height: 90, responsive: 'w-full max-w-[728px] h-[90px]' },
  rectangle: { width: 300, height: 250, responsive: 'w-[300px] h-[250px]' },
  mobile: { width: 320, height: 50, responsive: 'w-full max-w-[320px] h-[50px]' },
  skyscraper: { width: 160, height: 600, responsive: 'w-[160px] h-[600px]' },
  square: { width: 250, height: 250, responsive: 'w-[250px] h-[250px]' }
};

const AdPlaceholder = ({ size, className, label }: AdPlaceholderProps) => {
  const adConfig = adSizes[size];
  
  return (
    <div 
      className={cn(
        "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium relative overflow-hidden",
        adConfig.responsive,
        className
      )}
    >
      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-3 left-4 w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse animation-delay-500"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center p-2">
        <div className="text-xs opacity-60 mb-1">Google AdSense</div>
        <div className="font-semibold">{label || `Ad ${adConfig.width}x${adConfig.height}`}</div>
        <div className="text-xs opacity-40 mt-1">{adConfig.width} × {adConfig.height}</div>
      </div>

      {/* Subtle animation indicator */}
      <div className="absolute bottom-1 right-1 w-2 h-2">
        <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute inset-0 w-full h-full bg-green-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default AdPlaceholder;