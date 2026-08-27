import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const MOCK_WATCHLIST: any[] = [
  {
    id: 'wl-1',
    userId: 'mock-buyer-id-1',
    auctionId: 'demo-1',
    createdAt: new Date().toISOString(),
    auction: {
      id: 'demo-1',
      currentPrice: 15250,
      bidCount: 24,
      endTime: new Date(Date.now() + 86400000).toISOString(),
      listing: {
        title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD) - Space Black',
        condition: 'LIKE_NEW',
        images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' }],
      },
    },
  },
];

export class WatchlistsService {
  public static async getUserWatchlist(userId: string) {
    try {
      const items = await prisma.watchlist.findMany({
        where: { userId },
        include: {
          auction: {
            include: {
              listing: {
                include: { images: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (items.length > 0) return items;
    } catch (err) {}

    return MOCK_WATCHLIST;
  }

  public static async addToWatchlist(userId: string, auctionId: string) {
    try {
      const existing = await prisma.watchlist.findUnique({
        where: {
          userId_auctionId: { userId, auctionId },
        },
      });
      if (existing) return existing;

      const item = await prisma.watchlist.create({
        data: { userId, auctionId },
      });
      return item;
    } catch (err) {
      const mockItem = {
        id: `wl-${Date.now()}`,
        userId,
        auctionId,
        createdAt: new Date().toISOString(),
      };
      MOCK_WATCHLIST.push(mockItem);
      return mockItem;
    }
  }

  public static async removeFromWatchlist(userId: string, auctionId: string) {
    try {
      await prisma.watchlist.delete({
        where: {
          userId_auctionId: { userId, auctionId },
        },
      });
    } catch (err) {}
    return { success: true };
  }
}
