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
    if (order) {
      if (order.buyerId !== requestingUserId && order.sellerId !== requestingUserId) {
        throw new AppError('You are not authorized to view this order.', 403, 'FORBIDDEN');
      }
      return order;
    }

    const mock = MOCK_ORDERS.find((o) => o.id === orderId);
    if (!mock) throw new AppError('Order not found.', 404, 'NOT_FOUND');
    return mock;
  }

  public static async initiateOrderPayment(orderId: string, buyerId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { buyer: { select: { email: true } } },
    });
    if (!order) throw new AppError('Order not found.', 404, 'NOT_FOUND');
    if (order.buyerId !== buyerId) throw new AppError('Only the buyer can pay for this order.', 403, 'FORBIDDEN');
    if (order.status !== 'AWAITING_PAYMENT') throw new AppError('This order is not awaiting payment.', 400, 'ORDER_NOT_PAYABLE');

    const provider = new MockPaymentProvider();
    const result = await provider.createPayment(
      orderId,
      parseFloat(order.totalAmount.toString()),
      order.currency,
      order.buyer.email,
    );

    await prisma.payment.upsert({
      where: { orderId },
      update: {
        transactionRef: result.transactionRef,
        amount: order.totalAmount,
        currency: order.currency,
        status: 'PENDING',
        provider: 'MOCK',
      },
      create: {
        orderId,
        transactionRef: result.transactionRef,
        amount: order.totalAmount,
        currency: order.currency,
        status: 'PENDING',
        provider: 'MOCK',
      },
    });
    return result;
  }

  public static async processPaymentSuccess(transactionRef: string, buyerId: string) {
    const payment = await prisma.payment.findUnique({
      where: { transactionRef },
      include: { order: true },
    });
    if (!payment) throw new AppError('Payment transaction not found.', 404, 'PAYMENT_NOT_FOUND');
    if (payment.order.buyerId !== buyerId) throw new AppError('Only the order buyer can confirm payment.', 403, 'FORBIDDEN');

    const updated = await prisma.$transaction(async (tx) => {
      const confirmedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' },
      });
      return confirmedPayment;
    });

    return { status: updated.status, transactionRef: updated.transactionRef };
  }
}
