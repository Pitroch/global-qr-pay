
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { getTransactionById, processPayment } from '@/utils/paymentUtils';
import { Transaction } from '@/types/payment';
import { toast } from '@/components/ui/use-toast';

const PaymentConfirmPage = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundTransaction = getTransactionById(id);
      if (foundTransaction) {
        setTransaction(foundTransaction);
      } else {
        toast({
          title: "Transaction Not Found",
          description: "The transaction you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleConfirmPayment = async () => {
    if (!transaction) return;
    
    setIsLoading(true);
    
    try {
      // Update status to verifying
      const updatingTransaction: Transaction = {
        ...transaction,
        status: 'verifying',
      };
      setTransaction(updatingTransaction);
      
      // Process the payment
      const processedTransaction = await processPayment(updatingTransaction);
      
      // Update the transaction
      setTransaction(processedTransaction);
      
      // Navigate to the success page
      navigate(`/transaction/${processedTransaction.id}`);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      
      // Update status to failed
      setTransaction(prev => prev ? {
        ...prev,
        status: 'failed',
        failureReason: 'Payment processing error'
      } : null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!transaction) {
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
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Confirm Payment</h1>
          <p className="text-muted-foreground">
            Review and confirm your payment details
          </p>
        </div>
        
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Payment to</h2>
              <span className="text-sm text-muted-foreground">via Global QR Pay</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Merchant</span>
                <span className="font-medium">{transaction.paymentData.merchantName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-xl">₹{transaction.paymentData.amount.toFixed(2)}</span>
              </div>
              
              {transaction.paymentData.upiId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">UPI ID</span>
                  <span className="font-medium">{transaction.paymentData.upiId}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">From Account</span>
                <span className="font-medium">{transaction.fromAccount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {new Date(transaction.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-primary/5 rounded-lg">
            <Shield className="h-5 w-5 text-primary mr-2" />
            <p className="text-sm">
              Your payment is secured through Global QR Pay's secure payment gateway
            </p>
          </div>
          
          <Button
            className="w-full py-6 text-lg font-medium"
            disabled={isLoading}
            onClick={handleConfirmPayment}
          >
            {isLoading ? (
              <>
                Processing...
                <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </>
            ) : (
              <>
                Confirm Payment <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentConfirmPage;
