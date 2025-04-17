
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScanIcon, WalletIcon, ArrowRight, TrendingUp } from 'lucide-react';
import { UserProfile, Transaction } from '@/types/payment';
import { getUserProfile, getTransactionHistory, initializeUserProfile } from '@/utils/paymentUtils';

const Home = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initialize demo data
    initializeUserProfile();
    
    // Load user profile and transactions
    setProfile(getUserProfile());
    const transactions = getTransactionHistory();
    setRecentTransactions(transactions.slice(0, 5));
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Balance Card */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-primary to-accent">
          <CardContent className="pt-6">
            <div className="text-white space-y-1">
              <p className="text-sm opacity-80">Total Balance</p>
              <h2 className="text-3xl font-bold">
                ₹{profile?.balance.toLocaleString() || '0.00'}
              </h2>
            </div>
            
            <div className="flex justify-between mt-8">
              <Link to="/scan" className="w-full">
                <Button variant="outline" size="lg" className="w-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                  <ScanIcon className="mr-2 h-5 w-5" />
                  Scan & Pay
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/scan">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <ScanIcon className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Scan QR</h3>
              </CardContent>
            </Card>
          </Link>
          <Link to="/profile">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <WalletIcon className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">My Wallet</h3>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Link to="/history" className="text-sm text-primary flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <Link 
                    key={transaction.id} 
                    to={`/transaction/${transaction.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{transaction.paymentData.merchantName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{transaction.paymentData.amount.toFixed(2)}</p>
                        <p className={`text-xs ${
                          transaction.status === 'completed' 
                            ? 'text-success' 
                            : transaction.status === 'failed' 
                              ? 'text-destructive' 
                              : 'text-amber-500'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
