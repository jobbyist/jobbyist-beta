import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Crown, Check, Loader2 } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProSignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProSignupModal = ({ open, onOpenChange }: ProSignupModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = {
    monthly: {
      price: '$4.99',
      period: 'month',
      value: '4.99',
      description: 'Billed monthly',
      savings: null,
    },
    yearly: {
      price: '$49.99',
      period: 'year',
      value: '49.99',
      description: 'Billed annually',
      savings: 'Save 17%',
    },
  };

  const features = [
    'Unlimited AI-powered career assistant',
    'Priority access to exclusive jobs',
    'Advanced resume/CV builder with templates',
    'No advertisements',
    'Personalized job recommendations',
    'Application tracking and analytics',
    'Direct messaging with recruiters',
    'Early access to new features',
  ];

  const handlePayPalSuccess = async (details: any, data: any) => {
    setIsProcessing(true);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update user profile with subscription details
      const { error } = await supabase
        .from('profiles')
        .update({
          is_pro_user: true,
          pro_subscription_id: data.subscriptionID || data.orderID,
          pro_subscription_status: 'active',
          pro_subscription_plan: selectedPlan,
          pro_subscription_start_date: new Date().toISOString(),
          pro_subscription_end_date: new Date(
            Date.now() + (selectedPlan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
          ).toISOString(),
          pro_payment_provider: 'paypal',
          pro_last_payment_date: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: '🎉 Welcome to Jobbyist Pro!',
        description: 'Your subscription is now active. Enjoy all Pro features!',
      });

      onOpenChange(false);
      
      // Reload the page to reflect Pro status
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error activating subscription:', error);
      toast({
        title: 'Subscription Error',
        description: 'Failed to activate subscription. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    toast({
      title: 'Payment Failed',
      description: 'There was an error processing your payment. Please try again.',
      variant: 'destructive',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to Jobbyist Pro
          </DialogTitle>
          <DialogDescription>
            Unlock premium features and accelerate your job search
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Selection */}
          <div>
            <h3 className="font-semibold mb-3">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {selectedPlan === 'monthly' && (
                  <div className="absolute top-3 right-3">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Monthly</p>
                  <p className="text-3xl font-bold mt-1">{plans.monthly.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">{plans.monthly.description}</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  selectedPlan === 'yearly'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {plans.yearly.savings && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    {plans.yearly.savings}
                  </div>
                )}
                {selectedPlan === 'yearly' && (
                  <div className="absolute top-3 left-3">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Yearly</p>
                  <p className="text-3xl font-bold mt-1">{plans.yearly.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">{plans.yearly.description}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Features List */}
          <div>
            <h3 className="font-semibold mb-3">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PayPal Payment */}
          {user ? (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Complete Payment</h3>
              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Processing subscription...</span>
                </div>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
                    vault: true,
                    intent: 'subscription',
                  }}
                >
                  <PayPalButtons
                    createSubscription={(data, actions) => {
                      return actions.subscription.create({
                        plan_id: selectedPlan === 'monthly' 
                          ? import.meta.env.VITE_PAYPAL_MONTHLY_PLAN_ID 
                          : import.meta.env.VITE_PAYPAL_YEARLY_PLAN_ID,
                      });
                    }}
                    onApprove={handlePayPalSuccess}
                    onError={handlePayPalError}
                    style={{
                      layout: 'vertical',
                      shape: 'rect',
                      label: 'subscribe',
                    }}
                  />
                </PayPalScriptProvider>
              )}
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Secure payment powered by PayPal. Cancel anytime from your account settings.
              </p>
            </div>
          ) : (
            <div className="border-t pt-6">
              <p className="text-center text-muted-foreground mb-4">
                Please sign in to subscribe to Jobbyist Pro
              </p>
              <Button 
                onClick={() => {
                  onOpenChange(false);
                  window.location.href = '/auth';
                }}
                className="w-full"
              >
                Sign In to Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
