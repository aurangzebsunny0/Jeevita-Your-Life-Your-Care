import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import bkashQR from 'figma:asset/2e2d5a2c1148a6b9f95f31dbeaea93375e3f38ed.png';

interface PaymentPageProps {
  paymentData: {
    type: 'appointment' | 'medicine';
    amount: number;
    [key: string]: any;
  };
  onNavigate: (page: string) => void;
}

export function PaymentPage({ paymentData, onNavigate }: PaymentPageProps) {
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitPayment = () => {
    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    setIsSubmitted(true);
    toast.success('Payment submitted! Waiting for admin verification...');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-gray-900 mb-2">Verifying Payment...</h2>
              <p className="text-gray-600 mb-4">
                Our admin team is verifying your payment. This usually takes a few minutes.
              </p>
              <div className="inline-block bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border border-amber-200 px-4 py-2 rounded-lg">
                <p>Time remaining: {formatTime(timeLeft)}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-gray-900 mb-4">Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="text-gray-900 font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="text-gray-900">৳{paymentData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900 capitalize">
                    {paymentData.type === 'appointment' ? 'Doctor Appointment' : 'Medicine Order'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              You will receive a confirmation email once payment is verified.
            </p>

            <Button
              onClick={() => onNavigate('dashboard')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 mb-8">Complete Payment</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Payment Summary */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900 capitalize">
                  {paymentData.type === 'appointment' ? 'Doctor Appointment' : 'Medicine Order'}
                </span>
              </div>
              {paymentData.type === 'appointment' && paymentData.doctor && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="text-gray-900">{paymentData.doctor.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-2xl text-amber-600">৳{paymentData.amount}</span>
              </div>
            </div>
          </div>

          {/* bKash Payment Instructions */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Payment Instructions</h3>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-4">
              <div className="flex flex-col items-center">
                <img
                  src={bkashQR}
                  alt="bKash QR Code"
                  className="w-64 h-64 mb-4"
                />
                <p className="text-center mb-2">
                  <strong>bKash Number:</strong> 01625691878
                </p>
                <p className="text-sm text-gray-600 text-center">
                  Scan the QR code or send money to this number
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-gray-900 mb-2">Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Open your bKash/Nagad app</li>
                <li>Send ৳{paymentData.amount} to 01625691878</li>
                <li>Copy the transaction ID</li>
                <li>Enter the transaction ID below</li>
                <li>Click "I've Paid - Verify Now"</li>
              </ol>
            </div>
          </div>

          {/* Transaction ID Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="transactionId">Transaction ID *</Label>
              <Input
                id="transactionId"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter bKash/Nagad transaction ID"
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the transaction ID you received after sending the payment
              </p>
            </div>

            <Button
              onClick={handleSubmitPayment}
              disabled={!transactionId.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              I've Paid - Verify Now
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Your payment will be verified within 5 minutes. You'll receive a confirmation once approved.
          </p>
        </div>
      </div>
    </div>
  );
}
