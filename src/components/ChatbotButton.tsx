import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { ChatbotModal } from './ChatbotModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [isProUser, setIsProUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProStatus = async () => {
      if (!user) {
        setIsProUser(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_pro_user')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking pro status:', error);
          setIsProUser(false);
        } else {
          setIsProUser(data?.is_pro_user || false);
        }
      } catch (error) {
        console.error('Error checking pro status:', error);
        setIsProUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkProStatus();
  }, [user]);

  // Don't show chatbot if user is not logged in or not a Pro user
  if (!user || !isProUser || loading) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Chatbot Modal */}
      <ChatbotModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};