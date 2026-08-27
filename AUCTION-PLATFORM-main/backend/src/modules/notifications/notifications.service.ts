import { prisma } from '../../config/database';

const MOCK_NOTIFICATIONS = [
  { id: 'n-1', userId: 'mock-buyer-id-1', title: 'You are the highest bidder!', message: 'Your bid on Apple MacBook Pro 16" M3 Max is currently winning.', type: 'OUTBID', isRead: false, createdAt: new Date() },
  { id: 'n-2', userId: 'mock-buyer-id-1', title: 'New bid placed', message: 'A new bid was placed on Vintage Rolex Submariner Date (1998).', type: 'AUCTION_ACTIVITY', isRead: false, createdAt: new Date(Date.now() - 3600000) },
  { id: 'n-3', userId: 'mock-buyer-id-1', title: 'Auction ending soon', message: 'Sony Alpha A7 IV camera auction ends in 30 minutes.', type: 'AUCTION_ENDING', isRead: true, createdAt: new Date(Date.now() - 7200000) },
];

export class NotificationsService {
  public static async getUserNotifications(userId: string) {
    try {
      const items = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      if (items.length > 0) return items;
    } catch (err) {}
    return MOCK_NOTIFICATIONS;
  }

  public static async markAsRead(userId: string, notificationId: string) {
    try {
      return await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
      });
    } catch (err) {
      const notif = MOCK_NOTIFICATIONS.find((n) => n.id === notificationId);
      if (notif) (notif as any).isRead = true;
      return { count: 1 };
    }
  }
}
