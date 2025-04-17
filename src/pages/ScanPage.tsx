
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import QRScanner from '@/components/scanner/QRScanner';
import { parseQRCode, createTransaction } from '@/utils/paymentUtils';
import { QRPaymentData } from '@/types/payment';
import { toast } from '@/components/ui/use-toast';

const ScanPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = (decodedText: string) => {
    setIsProcessing(true);
    
    // Parse the QR code
    const paymentData = parseQRCode(decodedText);
    
    if (!paymentData) {
      toast({
        title: "Invalid QR Code",
        description: "Could not recognize the payment information in this QR code.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    // Create a transaction
    const transaction = createTransaction(paymentData);
    
    // Navigate to the payment confirmation page
    navigate(`/confirm/${transaction.id}`);
  };

  const handleScanError = (error: string) => {
    toast({
      title: "Scanning Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Scan QR Code</h1>
          <p className="text-muted-foreground">
            Scan any UPI or wallet QR code to make a payment
          </p>
        </div>
        
        <QRScanner 
          onScanSuccess={handleScanSuccess} 
          onScanError={handleScanError} 
        />
        
        {isProcessing && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Processing QR code...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScanPage;
