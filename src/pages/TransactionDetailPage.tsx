
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { getTransactionById } from '@/utils/paymentUtils';
import { Transaction } from '@/types/payment';
import { toast } from '@/components/ui/use-toast';

const TransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
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
        navigate('/history');
      }
    }
  }, [id, navigate]);

  if (!transaction) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const renderStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle2 className="h-16 w-16 text-success mb-4" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-destructive mb-4" />;
      default:
        return <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />;
    }
  };

  const renderStatusText = () => {
    switch (transaction.status) {
      case 'completed':
        return "Payment Successful";
      case 'failed':
        return "Payment Failed";
      case 'pending':
        return "Payment Pending";
      case 'verifying':
        return "Verifying Payment";
      case 'processing':
        return "Processing Payment";
      default:
        return "Unknown Status";
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            {renderStatusIcon()}
            
            <h2 className="text-2xl font-bold mb-2">
              ₹{transaction.paymentData.amount.toFixed(2)}
            </h2>
            
            <p className={`text-sm font-medium mb-6 ${
              transaction.status === 'completed' 
                ? 'text-success' 
                : transaction.status === 'failed' 
                  ? 'text-destructive' 
                  : 'text-amber-500'
            }`}>
              {renderStatusText()}
            </p>
            
            <div className="w-full space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Merchant</span>
                <span className="font-medium">{transaction.paymentData.merchantName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium">{transaction.id.substring(0, 8).toUpperCase()}</span>
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
              
              {transaction.completedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed At</span>
                  <span className="font-medium">
                    {new Date(transaction.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
              
              {transaction.failureReason && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Failure Reason</span>
                  <span className="font-medium text-destructive">
                    {transaction.failureReason}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button
            className="w-full"
            variant={transaction.status === 'completed' ? 'default' : 'outline'}
            onClick={() => navigate('/')}
          >
            {transaction.status === 'completed' 
              ? <>Return to Home <ArrowRight className="ml-2 h-5 w-5" /></>
              : 'Go Back'
            }
          </Button>
          
          {transaction.status === 'completed' && (
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-5 w-5" /> Download Receipt
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TransactionDetailPage;
