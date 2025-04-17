
import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanIcon, X, Camera, CameraOff } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-scanner-container';

  const checkCameraPermission = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      if (cameras.length === 0) {
        setError("No camera found on your device");
        return false;
      }
      
      // Try to get camera stream to check permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately after checking
      stream.getTracks().forEach(track => track.stop());
      setHasCameraPermission(true);
      return true;
    } catch (err) {
      console.error("Camera permission error:", err);
      setHasCameraPermission(false);
      setError("Camera access denied. Please enable camera permissions.");
      return false;
    }
  };

  const startScanner = async () => {
    try {
      setError(null);
      
      // Check camera permission first
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        if (onScanError) onScanError("Camera permission denied");
        return;
      }
      
      setIsScanning(true);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignoring errors during scanning as they're usually just frames without QR codes
          console.log(errorMessage);
        }
      );
    } catch (err) {
      console.error("Scanner startup error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start scanner';
      handleScanError(errorMessage);
      setIsScanning(false);
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
            {hasCameraPermission === false ? (
              <CameraOff className="h-16 w-16 text-destructive mb-4" />
            ) : (
              <Camera className="h-16 w-16 text-primary mb-4" />
            )}
            
            <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2>
            
            {hasCameraPermission === false ? (
              <p className="text-destructive mb-6">
                Camera access denied. Please enable camera permissions in your browser settings.
              </p>
            ) : (
              <p className="text-muted-foreground mb-6">
                Position the QR code within the frame to scan and process the payment
              </p>
            )}
            
            <Button 
              className="w-full max-w-xs" 
              onClick={startScanner} 
              size="lg"
              disabled={hasCameraPermission === false}
            >
              {hasCameraPermission === false ? "Enable Camera Access" : "Start Scanning"}
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
