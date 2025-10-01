import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

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

const AdPlaceholder = ({ size, className }: AdPlaceholderProps) => {
  const adConfig = adSizes[size];
  const adRef = useRef<HTMLModElement>(null);
  
  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);
  
  return (
    <div 
      className={cn(
        adConfig.responsive,
        className
      )}
    >
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1237323355260727"
        data-ad-slot="6085699333"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default AdPlaceholder;