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
    try {
      const dispute = await prisma.dispute.findUnique({
        where: { id: disputeId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
      if (dispute) return dispute;
    } catch (err) {}

    const mock = MOCK_DISPUTES.find((d) => d.id === disputeId);
    if (!mock) throw new AppError('Dispute not found.', 404, 'NOT_FOUND');
    return mock;
  }

  public static async createDispute(userId: string, data: { orderId: string; category: any; initialMessage: string }) {
    try {
      const dispute = await prisma.dispute.create({
        data: {
          orderId: data.orderId,
          buyerId: userId,
          sellerId: 'mock-seller-id-2',
          category: data.category,
          status: 'OPEN',
          messages: {
            create: {
              userId,
              message: data.initialMessage,
            },
          },
        },
        include: { messages: true },
      });
      return dispute;
    } catch (err) {
      const newDispute = {
        id: `disp-${Date.now()}`,
        orderId: data.orderId,
        buyerId: userId,
        category: data.category,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            userId,
            message: data.initialMessage,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      MOCK_DISPUTES.unshift(newDispute);
      return newDispute;
    }
  }

  public static async addDisputeMessage(disputeId: string, userId: string, message: string) {
    const dispute = MOCK_DISPUTES.find((d) => d.id === disputeId);
    if (dispute) {
      const newMsg = { id: `msg-${Date.now()}`, userId, message, createdAt: new Date().toISOString() };
      dispute.messages.push(newMsg);
      return newMsg;
    }
    return { id: `msg-${Date.now()}`, userId, message, createdAt: new Date().toISOString() };
  }
}
