import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  fullName: string;
  dateOfBirth: string;
  city: string;
  monthlyIncome: string;
  primaryBank: string;
  expenses: {
    travel: string;
    utilities: string;
    groceries: string;
    shopping: string;
    dining: string;
    foodDelivery: string;
  };
}

interface ProfileErrors {
  [key: string]: string | undefined;
}

const banks = [
  "Chase",
  "Bank of America", 
  "Wells Fargo",
  "Citibank",
  "Capital One",
  "American Express",
  "Discover",
  "Other"
];

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    dateOfBirth: "",
    city: "",
    monthlyIncome: "",
    primaryBank: "",
    expenses: {
      travel: "",
      utilities: "",
      groceries: "",
      shopping: "",
      dining: "",
      foodDelivery: "",
    },
  });
  
  const [errors, setErrors] = useState<ProfileErrors>({});

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Full name must be at least 2 characters";
        return undefined;
      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) return "You must be at least 18 years old";
        return undefined;
      case "city":
        if (!value.trim()) return "City is required";
        return undefined;
      case "monthlyIncome":
        if (!value) return "Monthly income is required";
        if (isNaN(Number(value)) || Number(value) <= 0) return "Please enter a valid income amount";
        return undefined;
      case "primaryBank":
        if (!value) return "Please select your primary bank";
        return undefined;
      default:
        // For expense fields
        if (value && (isNaN(Number(value)) || Number(value) < 0)) return "Please enter a valid amount";
        return undefined;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("expenses.")) {
      const expenseType = field.replace("expenses.", "") as keyof ProfileData["expenses"];
      setProfileData(prev => ({
        ...prev,
        expenses: { ...prev.expenses, [expenseType]: value }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: ProfileErrors = {};
    
    // Validate required fields
    newErrors.fullName = validateField("fullName", profileData.fullName);
    newErrors.dateOfBirth = validateField("dateOfBirth", profileData.dateOfBirth);
    newErrors.city = validateField("city", profileData.city);
    newErrors.monthlyIncome = validateField("monthlyIncome", profileData.monthlyIncome);
    newErrors.primaryBank = validateField("primaryBank", profileData.primaryBank);
    
    // Validate expense fields
    Object.entries(profileData.expenses).forEach(([key, value]) => {
      const error = validateField(`expenses.${key}`, value);
      if (error) newErrors[`expenses.${key}`] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      toast({
        title: "Please fix the errors",
        description: "Some fields need your attention",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    
    // Store profile data
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    toast({
      title: "Profile saved!",
      description: "Your information has been saved successfully",
    });
    
    navigate("/consent");
  };

  const isFormValid = () => {
    return (
      profileData.fullName &&
      profileData.dateOfBirth &&
      profileData.city &&
      profileData.monthlyIncome &&
      profileData.primaryBank &&
      !Object.values(errors).some(Boolean)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center p-4 border-b bg-card">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mr-3"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center">
          <User className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-lg font-semibold">Profile Details</h1>
        </div>
      </div>

      <div className="p-4 pb-24">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Tell us about yourself</CardTitle>
            <p className="text-sm text-muted-foreground">
              This helps us provide better recommendations
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={profileData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className={errors.dateOfBirth ? "border-destructive" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={profileData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="5000"
                value={profileData.monthlyIncome}
                onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                className={errors.monthlyIncome ? "border-destructive" : ""}
              />
              {errors.monthlyIncome && (
                <p className="text-sm text-destructive">{errors.monthlyIncome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Primary Bank</Label>
              <Select
                value={profileData.primaryBank}
                onValueChange={(value) => handleInputChange("primaryBank", value)}
              >
                <SelectTrigger className={errors.primaryBank ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your primary bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.primaryBank && (
                <p className="text-sm text-destructive">{errors.primaryBank}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monthly Expenses by Category</h3>
              <p className="text-sm text-muted-foreground">
                Enter your approximate monthly spending (optional)
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(profileData.expenses).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} ($)
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      placeholder="0"
                      value={value}
                      onChange={(e) => handleInputChange(`expenses.${key}`, e.target.value)}
                      className={errors[`expenses.${key}`] ? "border-destructive" : ""}
                    />
                    {errors[`expenses.${key}`] && (
                      <p className="text-sm text-destructive">{errors[`expenses.${key}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};