import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloatingHomeButton = () => {
  return (
    <Link to="/">
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110"
        aria-label="Return to homepage"
      >
        <Home className="h-6 w-6" />
      </Button>
    </Link>
  );
};
