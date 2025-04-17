
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { UserProfile } from '@/types/payment';
import { getUserProfile, initializeUserProfile } from '@/utils/paymentUtils';
import { User, Wallet, CreditCard, LogOut, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Initialize demo data
    initializeUserProfile();
    
    // Load user profile
    setProfile(getUserProfile());
  }, []);

  if (!profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings
          </p>
        </div>
        
        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="bg-primary h-20"></div>
          <div className="px-6 pb-6 relative">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg absolute -top-10 flex items-center justify-center overflow-hidden">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="pt-12">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </Card>
        
        {/* Wallet */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Wallet className="mr-2 h-5 w-5" /> 
              My Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="text-xl font-bold">₹{profile.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">UPI ID</span>
                <span>{profile.upiId}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Wallet
            </Button>
          </CardFooter>
        </Card>
        
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between rounded-none p-4 h-auto font-normal"
              >
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>Personal Details</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
              
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between rounded-none p-4 h-auto font-normal"
              >
                <div className="flex items-center">
                  <CreditCard className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>Payment Methods</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
              
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between rounded-none p-4 h-auto font-normal"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>Sign Out</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Global QR Pay • Version 1.0.0
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
