import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  email: string;
  password: string;
  phone: string;
  otp: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
}

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Phone number is required";
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) return "Please enter a valid 10-digit phone number";
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

const handleSubmit = async () => {
  const newErrors: FormErrors = {};

  if (activeTab === "login") {
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
  } else {
    newErrors.phone = validatePhone(formData.phone);
    if (!formData.otp) newErrors.otp = "OTP is required";
  }

  setErrors(newErrors);

  if (Object.values(newErrors).some(Boolean)) return;

  setIsLoading(true);

  try {
    if (activeTab === "signup") {
      // 🧠 Real backend call to create user
      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email || null,
          phone: formData.phone,
          passwordHash: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("userId", data.id); // Save for profile step

      toast({
        title: "Account Created",
        description: "Your account was created successfully!",
      });

      navigate("/profile");
    } else {
      // 🧪 Keep login logic mocked (no backend needed)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Login Successful",
        description: "You're now logged in",
      });

      navigate("/profile");
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const isFormValid = () => {
    if (activeTab === "login") {
      return formData.email && formData.password && !errors.email && !errors.password;
    } else {
      return formData.phone && formData.otp && !errors.phone && !errors.otp;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">RewardsTracker</h1>
          <p className="text-muted-foreground mt-2">Maximize your credit card rewards</p>
        </div>

        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value)}
                    maxLength={6}
                    className={errors.otp ? "border-destructive" : ""}
                  />
                  {errors.otp && (
                    <p className="text-sm text-destructive">{errors.otp}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Use any 6-digit code for demo purposes
                  </p>
                </div>
              </TabsContent>
              
              <Button
                className="w-full mt-6"
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? "Processing..." : activeTab === "login" ? "Log In" : "Create Account"}
              </Button>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};