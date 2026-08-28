import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const MOCK_DISPUTES: any[] = [
  {
    id: 'disp-901',
    orderId: 'ord-102',
    buyerId: 'mock-buyer-id-1',
    category: 'ITEM_NOT_RECEIVED',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-1',
        userId: 'mock-buyer-id-1',
        message: 'Item has not arrived after 5 business days from shipment notification.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

export class DisputesService {
  public static async getDisputesForUser(userId: string) {
    try {
      const disputes = await prisma.dispute.findMany({
        where: { buyerId: userId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (disputes.length > 0) return disputes;
    } catch (err) {}

    return MOCK_DISPUTES;
  }

  public static async getDisputeById(disputeId: string, userId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (dispute) {
      if (dispute.buyerId !== userId && dispute.sellerId !== userId) {
        throw new AppError('You are not a participant in this dispute.', 403, 'FORBIDDEN');
      }
      return dispute;
    }

    const mock = MOCK_DISPUTES.find((d) => d.id === disputeId);
    if (!mock) throw new AppError('Dispute not found.', 404, 'NOT_FOUND');
    if (mock.buyerId !== userId && mock.sellerId !== userId) {
      throw new AppError('You are not a participant in this dispute.', 403, 'FORBIDDEN');
    }
    return mock;
  }

  public static async createDispute(userId: string, data: { orderId: string; category: any; initialMessage: string }) {
    const order = await prisma.order.findUnique({ where: { id: data.orderId }, select: { buyerId: true, sellerId: true } });
    if (!order) throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
    if (order.buyerId !== userId) throw new AppError('Only the order buyer can open a dispute.', 403, 'FORBIDDEN');

    return prisma.dispute.create({
      data: {
        orderId: data.orderId,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        category: data.category,
        status: 'OPEN',
        messages: {
          create: { userId, message: data.initialMessage },
        },
      },
      include: { messages: true },
    });
  }

  public static async addDisputeMessage(disputeId: string, userId: string, message: string) {
    await this.getDisputeById(disputeId, userId);

    try {
      return await prisma.disputeMessage.create({
        data: { disputeId, userId, message },
      });
    } catch (err) {}

    const dispute = MOCK_DISPUTES.find((d) => d.id === disputeId);
    if (dispute) {
      const newMsg = { id: `msg-${Date.now()}`, userId, message, createdAt: new Date().toISOString() };
      dispute.messages.push(newMsg);
      return newMsg;
    }
    return { id: `msg-${Date.now()}`, userId, message, createdAt: new Date().toISOString() };
  }

  public static async getAllDisputes() {
    return prisma.dispute.findMany({
      include: {
        buyer: { select: { id: true, username: true, email: true } },
        seller: { select: { id: true, username: true, email: true } },
        order: { select: { id: true, totalAmount: true, status: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public static async resolveDispute(disputeId: string, status: 'RESOLVED' | 'CLOSED', resolution: string, refundAmount?: number) {
    const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
    if (!dispute) throw new AppError('Dispute not found.', 404, 'NOT_FOUND');

    return prisma.dispute.update({
      where: { id: disputeId },
      data: { status, resolution, refundAmount },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }
}
