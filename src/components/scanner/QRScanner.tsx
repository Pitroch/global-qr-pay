
import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanIcon, X } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-scanner-container';

  const startScanner = async () => {
    try {
      setError(null);
      setIsScanning(true);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignoring errors during scanning as they're usually just frames without QR codes
          console.log(errorMessage);
        }
      );
    } catch (err) {
      handleScanError(err instanceof Error ? err.message : 'Failed to start scanner');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const handleScanSuccess = async (decodedText: string) => {
    await stopScanner();
    onScanSuccess(decodedText);
  };

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
    if (onScanError) {
      onScanError(errorMessage);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-6">
        {!isScanning ? (
          <Card className="w-full p-6 flex flex-col items-center text-center">
            <ScanIcon className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2>
            <p className="text-muted-foreground mb-6">
              Position the QR code within the frame to scan and process the payment
            </p>
            <Button 
              className="w-full max-w-xs" 
              onClick={startScanner} 
              size="lg"
            >
              Start Scanning
            </Button>
          </Card>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square mb-4 rounded-lg overflow-hidden border-4 border-primary">
              <div 
                id={scannerContainerId} 
                className="w-full h-full"
              ></div>
              
              {/* Scanner overlay with corner markers for better UX */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white"></div>
              </div>
              
              <Button 
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full" 
                size="icon" 
                variant="ghost" 
                onClick={stopScanner}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Align the QR code within the frame to scan
              </p>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
