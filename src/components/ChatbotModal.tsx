import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { aiService, type ChatMessage } from '@/lib/openai';
import { useToast } from '@/components/ui/use-toast';

interface ChatbotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatbotModal = ({ open, onOpenChange }: ChatbotModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured] = useState(aiService.isConfigured());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Initialize with welcome message when modal opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: isConfigured 
          ? "Hi! I'm your Jobbyist AI assistant. I'm here to help you with job searching, career advice, and navigating our platform. How can I assist you today?"
          : "Hi! I'm your Jobbyist AI assistant, but I'm currently not configured. Please contact support to enable AI features."
      }]);
    }
  }, [open, messages.length, isConfigured]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!isConfigured) {
      toast({
        title: "AI Not Configured",
        description: "OpenAI integration is not set up. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const updatedMessages = [...messages, userMessage];
      const response = await aiService.sendMessage(updatedMessages);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Jobbyist AI Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            {!isConfigured && (
              <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2 text-sm text-orange-700">
                <AlertCircle className="h-4 w-4" />
                AI features require configuration. Contact support for setup.
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConfigured ? "Ask me anything about jobs or careers..." : "AI not configured"}
                disabled={isLoading || !isConfigured}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !isConfigured}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};