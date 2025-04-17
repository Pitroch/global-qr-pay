
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import QRScanner from '@/components/scanner/QRScanner';
import { parseQRCode, createTransaction } from '@/utils/paymentUtils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';

const ScanPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  // Ensure component is fully mounted before initializing scanner
  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleScanSuccess = (decodedText: string) => {
    setIsProcessing(true);
    setScanError(null);
    
    // Log the scanned text for debugging
    console.log("Scanned QR code:", decodedText);
    
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
    console.error("Scan error:", error);
    setScanError(error);
    setIsProcessing(false);
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
        
        {scanError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{scanError}</AlertDescription>
          </Alert>
        )}
        
        {isReady && (
          <QRScanner 
            onScanSuccess={handleScanSuccess} 
            onScanError={handleScanError} 
          />
        )}
        
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
