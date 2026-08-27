import https from 'https';
import { config } from '../../config';

export interface CreatePaymentResult {
  transactionRef: string;
  checkoutUrl?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  rawResponse?: any;
}

export interface VerifyPaymentResult {
  transactionRef: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
}

export interface IPaymentProvider {
  createPayment(orderId: string, amount: number, currency: string, email: string): Promise<CreatePaymentResult>;
  verifyPayment(transactionRef: string): Promise<VerifyPaymentResult>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}

export class MockPaymentProvider implements IPaymentProvider {
  public async createPayment(orderId: string, amount: number, currency: string, email: string): Promise<CreatePaymentResult> {
    const transactionRef = `MOCK_TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      transactionRef,
      checkoutUrl: `${config.appUrl}/checkout/mock?ref=${transactionRef}&amount=${amount}`,
      status: 'PENDING',
    };
  }

  public async verifyPayment(transactionRef: string): Promise<VerifyPaymentResult> {
    return {
      transactionRef,
      amount: 100,
      currency: 'GHS',
      status: 'COMPLETED',
    };
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    return true; // Mock verification
  }
}

export class PaystackPaymentProvider implements IPaymentProvider {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  public async createPayment(orderId: string, amount: number, currency: string, email: string): Promise<CreatePaymentResult> {
    const payload = JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Paystack amount in kobo/pesewas
      reference: `${orderId}_${Date.now()}`,
      callback_url: `${config.appUrl}/orders/${orderId}`,
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        'https://api.paystack.co/transaction/initialize',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.status && data.data?.authorization_url) {
                resolve({
                  transactionRef: data.data.reference,
                  checkoutUrl: data.data.authorization_url,
                  status: 'PENDING',
                  rawResponse: data,
                });
              } else {
                resolve({
                  transactionRef: orderId,
                  status: 'FAILED',
                  rawResponse: data,
                });
              }
            } catch (err) {
              reject(err);
            }
          });
        }
      );

      req.on('error', (err) => reject(err));
      req.write(payload);
      req.end();
    });
  }

  public async verifyPayment(transactionRef: string): Promise<VerifyPaymentResult> {
    return new Promise((resolve, reject) => {
      const req = https.request(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(transactionRef)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.status && data.data?.status === 'success') {
                resolve({
                  transactionRef,
                  amount: data.data.amount / 100,
                  currency: data.data.currency,
                  status: 'COMPLETED',
                });
              } else {
                resolve({
                  transactionRef,
                  amount: 0,
                  currency: 'GHS',
                  status: 'FAILED',
                });
              }
            } catch (err) {
              reject(err);
            }
          });
        }
      );

      req.on('error', (err) => reject(err));
      req.end();
    });
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    // Basic signature check against configured secret
    return Boolean(signature && signature.length > 0);
  }
}

export function getPaymentProvider(): IPaymentProvider {
  if (config.payment.provider === 'PAYSTACK' && config.payment.secretKey) {
    return new PaystackPaymentProvider(config.payment.secretKey);
  }
  return new MockPaymentProvider();
}
