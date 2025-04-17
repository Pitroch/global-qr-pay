
import { QRPaymentData, Transaction } from '@/types/payment';

// This function would normally parse a UPI QR code, but for demo we'll mock it
export const parseQRCode = (qrData: string): QRPaymentData | null => {
  try {
    // In a real app, this would parse actual UPI/wallet QR code formats
    // For this demo, we'll support a few mock formats
    
    // Check if it's our mock format (JSON string)
    if (qrData.startsWith('{') && qrData.endsWith('}')) {
      return JSON.parse(qrData);
    }
    
    // Mock UPI format: upi://pay?pa=upiid@provider&pn=MerchantName&am=amount
    if (qrData.startsWith('upi://pay?')) {
      const params = new URLSearchParams(qrData.replace('upi://pay?', ''));
      const upiId = params.get('pa') || '';
      const merchantName = params.get('pn') || 'Unknown Merchant';
      const amount = parseFloat(params.get('am') || '0');
      
      return {
        paymentId: generateId(),
        merchantName,
        amount,
        upiId,
        currency: 'INR', // Default for UPI
        timestamp: Date.now(),
      };
    }
    
    // For demo purposes, if we couldn't parse it, return a mock payment
    return {
      paymentId: generateId(),
      merchantName: 'Demo Merchant',
      amount: 100.00,
      currency: 'INR',
      upiId: 'merchant@upi',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};

// Mock function to simulate payment processing
export const processPayment = async (transaction: Transaction): Promise<Transaction> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // For demo, we'll always succeed
      const updatedTransaction: Transaction = {
        ...transaction,
        status: 'completed',
        completedAt: Date.now(),
      };
      
      // Save to mock storage
      const transactions = getTransactionHistory();
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      
      resolve(updatedTransaction);
    }, 2000);
  });
};

// Create a new transaction
export const createTransaction = (paymentData: QRPaymentData): Transaction => {
  const transaction: Transaction = {
    id: generateId(),
    paymentData,
    status: 'pending',
    fromAccount: 'user@globalpay', // In a real app, this would be the user's account
    toAccount: paymentData.upiId || 'merchant@wallet',
    createdAt: Date.now(),
  };
  
  // Save to mock storage
  const transactions = getTransactionHistory();
  transactions.unshift(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  return transaction;
};

// Get transaction history from localStorage
export const getTransactionHistory = (): Transaction[] => {
  try {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return [];
  }
};

// Helper to generate mock IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get a transaction by ID
export const getTransactionById = (id: string): Transaction | undefined => {
  const transactions = getTransactionHistory();
  return transactions.find(t => t.id === id);
};

// Initialize mock user profile
export const initializeUserProfile = () => {
  if (!localStorage.getItem('userProfile')) {
    localStorage.setItem('userProfile', JSON.stringify({
      id: 'user123',
      name: 'Demo User',
      email: 'user@example.com',
      upiId: 'user@globalpay',
      balance: 10000, // Starting with ₹10,000
    }));
  }
};

// Get user profile
export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};
