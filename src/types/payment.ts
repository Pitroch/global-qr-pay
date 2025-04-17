
export interface QRPaymentData {
  paymentId: string;
  merchantName: string;
  amount: number;
  currency: string;
  upiId?: string;
  walletProvider?: string;
  reference?: string;
  timestamp: number;
}

export interface Transaction {
  id: string;
  paymentData: QRPaymentData;
  status: 'pending' | 'verifying' | 'processing' | 'completed' | 'failed';
  fromAccount: string;
  toAccount: string;
  createdAt: number;
  completedAt?: number;
  failureReason?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  upiId: string;
  balance: number;
}

export type PaymentMethod = 'upi' | 'wallet';
