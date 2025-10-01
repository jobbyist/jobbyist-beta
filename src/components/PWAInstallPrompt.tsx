import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if 30 days have passed since last prompt
    const lastPromptDate = localStorage.getItem('pwaLastPromptDate');
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    
    const shouldShowPrompt = () => {
      if (!lastPromptDate) return true;
      const daysSinceLastPrompt = Date.now() - parseInt(lastPromptDate);
      return daysSinceLastPrompt >= thirtyDaysInMs;
    };

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as { standalone?: boolean }).standalone === true;

    if (isInstalled) {
      return; // Don't show if already installed
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Only show prompt if 30 days have passed
      if (shouldShowPrompt()) {
        // Wait a bit before showing the prompt (better UX)
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000); // Show after 5 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Update last prompt date
    localStorage.setItem('pwaLastPromptDate', Date.now().toString());
    
    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // Update last prompt date so we don't show again for 30 days
    localStorage.setItem('pwaLastPromptDate', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Install Jobbyist App
          </DialogTitle>
          <DialogDescription>
            Get quick access to Jobbyist with our mobile app experience. 
            Install now for:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-primary">✓</span>
            </div>
            <div>
              <p className="font-medium text-sm">Offline Access</p>
              <p className="text-xs text-muted-foreground">Browse jobs even without internet</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-primary">✓</span>
            </div>
            <div>
              <p className="font-medium text-sm">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Get instant alerts for new jobs</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-primary">✓</span>
            </div>
            <div>
              <p className="font-medium text-sm">Fast Performance</p>
              <p className="text-xs text-muted-foreground">Lightning-fast app experience</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-primary">✓</span>
            </div>
            <div>
              <p className="font-medium text-sm">Home Screen Access</p>
              <p className="text-xs text-muted-foreground">Quick access from your device</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleDismiss} className="w-full sm:w-auto">
            <X className="h-4 w-4 mr-2" />
            Maybe Later
          </Button>
          <Button onClick={handleInstall} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Install Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
