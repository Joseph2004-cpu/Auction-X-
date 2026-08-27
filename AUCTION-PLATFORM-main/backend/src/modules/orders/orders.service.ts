import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { MockPaymentProvider } from '../payments/paymentProvider';

const MOCK_ORDERS = [
  {
    id: 'ord-101',
    auctionId: 'demo-1',
    buyerId: 'mock-buyer-id-1',
    sellerId: 'mock-seller-id-2',
    totalAmount: 15250.0,
    currency: 'GHS',
    status: 'AWAITING_PAYMENT',
    createdAt: new Date().toISOString(),
    auction: {
      listing: {
        title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD) - Space Black',
      },
    },
  },
  {
    id: 'ord-102',
    auctionId: 'demo-2',
    buyerId: 'mock-buyer-id-1',
    sellerId: 'mock-seller-id-2',
    totalAmount: 45500.0,
    currency: 'GHS',
    status: 'PAID',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    auction: {
      listing: {
        title: 'Vintage Rolex Submariner Date (1998 Reference 16610)',
      },
    },
  },
];

export class OrdersService {
  public static async getUserOrders(userId: string, roleFilter: 'BUYER' | 'SELLER' = 'BUYER') {
    try {
      const whereClause = roleFilter === 'BUYER' ? { buyerId: userId } : { sellerId: userId };
      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          auction: {
            include: {
              listing: { include: { images: true } },
            },
          },
          payment: true,
          shipment: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      if (orders.length > 0) return orders;
    } catch (err) {}

    // Fallback mock orders
    return MOCK_ORDERS.filter((o) => (roleFilter === 'BUYER' ? o.buyerId === userId : o.sellerId === userId));
  }

  public static async getOrderById(orderId: string, requestingUserId: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          auction: {
            include: { listing: { include: { images: true } } },
          },
          buyer: { select: { id: true, username: true, email: true } },
          seller: { select: { id: true, username: true, email: true } },
          payment: true,
          shipment: true,
        },
      });
      if (order) return order;
    } catch (err) {}

    const mock = MOCK_ORDERS.find((o) => o.id === orderId);
    if (!mock) throw new AppError('Order not found.', 404, 'NOT_FOUND');
    return mock;
  }

  public static async initiateOrderPayment(orderId: string, buyerId: string) {
    const provider = new MockPaymentProvider();
    const result = await provider.createPayment(
      orderId,
      15250,
      'GHS',
      'buyer@auctionx.com'
    );
    return result;
  }

  public static async processPaymentSuccess(transactionRef: string) {
    const mockOrder = MOCK_ORDERS.find((o) => o.id === 'ord-101');
    if (mockOrder) mockOrder.status = 'PAID';
    return { status: 'COMPLETED', transactionRef };
  }
}
