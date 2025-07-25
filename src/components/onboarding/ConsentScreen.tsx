import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ConsentScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const handleSubmit = async () => {
    if (!hasConsented) {
      toast({
        title: "Consent required",
        description: "Please agree to the Terms and Conditions to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    
    // Store consent
    localStorage.setItem('hasConsented', 'true');
    
    toast({
      title: "Welcome aboard!",
      description: "Your account setup is complete",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center p-4 border-b bg-card">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="mr-3"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-lg font-semibold">Terms & Conditions</h1>
        </div>
      </div>

      <div className="p-4 pb-24">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Privacy & Terms</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Please review and accept our terms to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-3">RewardsTracker Terms of Service</h3>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>1. Data Collection and Usage:</strong> We collect your financial information 
                  to provide personalized credit card recommendations and rewards optimization. 
                  Your data is encrypted and stored securely.
                </p>
                
                <p>
                  <strong>2. Credit Card Recommendations:</strong> Our recommendations are based on your 
                  spending patterns and preferences. We may receive compensation from financial 
                  institutions for successful applications.
                </p>
                
                <p>
                  <strong>3. Privacy Protection:</strong> We never sell your personal information to 
                  third parties. Your financial data is anonymized for analytical purposes and 
                  protected with bank-level security.
                </p>
                
                <p>
                  <strong>4. Account Security:</strong> You are responsible for maintaining the 
                  confidentiality of your account credentials. Please notify us immediately of 
                  any unauthorized access.
                </p>
                
                <p>
                  <strong>5. Service Availability:</strong> While we strive for 100% uptime, 
                  we cannot guarantee uninterrupted service. We will notify users of any 
                  planned maintenance.
                </p>
                
                <p>
                  <strong>6. Updates to Terms:</strong> We may update these terms periodically. 
                  Users will be notified of significant changes via email or in-app notifications.
                </p>
                
                <p>
                  <strong>7. Termination:</strong> You may terminate your account at any time. 
                  We reserve the right to suspend accounts that violate our terms of service.
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Your Rights:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Access and download your data at any time</li>
                  <li>• Request deletion of your account and data</li>
                  <li>• Opt out of marketing communications</li>
                  <li>• Contact support for any privacy concerns</li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={hasConsented}
                  onCheckedChange={(checked) => setHasConsented(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="consent"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I have read and agree to the{" "}
                  <span className="text-primary font-medium">Terms and Conditions</span> and{" "}
                  <span className="text-primary font-medium">Privacy Policy</span>. 
                  I understand how my data will be used and consent to the collection 
                  and processing of my information as described above.
                </label>
              </div>
              
              {!hasConsented && (
                <p className="text-sm text-muted-foreground mt-3 ml-6">
                  You must agree to the terms to continue using RewardsTracker
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!hasConsented || isLoading}
        >
          {isLoading ? "Setting up your account..." : "Accept & Continue"}
        </Button>
      </div>
    </div>
  );
};