import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, Award, Settings, User, DollarSign } from "lucide-react";

interface UserData {
  email: string;
  method: string;
}

interface ProfileData {
  fullName: string;
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

export const DashboardScreen = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('profileData');
    
    if (storedUser) setUserData(JSON.parse(storedUser));
    if (storedProfile) setProfileData(JSON.parse(storedProfile));
  }, []);

  const totalExpenses = profileData ? 
    Object.values(profileData.expenses)
      .filter(expense => expense && !isNaN(Number(expense)))
      .reduce((sum, expense) => sum + Number(expense), 0) : 0;

  const savingsRate = profileData && Number(profileData.monthlyIncome) > 0 ? 
    ((Number(profileData.monthlyIncome) - totalExpenses) / Number(profileData.monthlyIncome) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome{profileData ? `, ${profileData.fullName.split(' ')[0]}` : ''}! 🎉
            </h1>
            <p className="text-primary-foreground/80 mt-1">
              Your rewards journey starts here
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 text-primary-foreground mx-auto mb-2" />
              <p className="text-xs text-primary-foreground/80">Rewards Rate</p>
              <p className="text-lg font-bold text-primary-foreground">2.5%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-primary-foreground mx-auto mb-2" />
              <p className="text-xs text-primary-foreground/80">This Month</p>
              <p className="text-lg font-bold text-primary-foreground">$47</p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-primary-foreground mx-auto mb-2" />
              <p className="text-xs text-primary-foreground/80">Total Earned</p>
              <p className="text-lg font-bold text-primary-foreground">$342</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profileData && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{profileData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{profileData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Bank:</span>
                  <span className="font-medium">{profileData.primaryBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Income:</span>
                  <span className="font-medium">${Number(profileData.monthlyIncome).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Savings Rate:</span>
                  <Badge variant={Number(savingsRate) > 20 ? "default" : "secondary"}>
                    {savingsRate}%
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Spending Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileData && totalExpenses > 0 ? (
              <div className="space-y-3">
                {Object.entries(profileData.expenses).map(([category, amount]) => {
                  if (!amount || Number(amount) === 0) return null;
                  const percentage = ((Number(amount) / totalExpenses) * 100).toFixed(1);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">${Number(amount).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Monthly Expenses:</span>
                    <span>${totalExpenses.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No expense data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              Recommended Cards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">Chase Sapphire Preferred</h4>
                <Badge variant="default">95% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Perfect for travel and dining rewards based on your spending
              </p>
              <div className="flex justify-between text-sm">
                <span>Welcome Bonus:</span>
                <span className="font-medium">60,000 points</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">Capital One Venture X</h4>
                <Badge variant="secondary">87% Match</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Great for travel purchases and general spending
              </p>
              <div className="flex justify-between text-sm">
                <span>Welcome Bonus:</span>
                <span className="font-medium">75,000 miles</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};