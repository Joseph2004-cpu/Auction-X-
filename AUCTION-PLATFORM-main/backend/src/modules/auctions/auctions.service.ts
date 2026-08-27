import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { recordAuditLog } from '../../security/audit';
import { getSocketIO } from '../../websocket';

export class AuctionsService {
  public static async finalizeExpiredAuctions() {
    const now = new Date();

    // Find active auctions past their endTime (Section 13 & 14 of Master Prompt)
    let expiredAuctions: any[] = [];
    try {
      expiredAuctions = await prisma.auction.findMany({
        where: {
          status: 'ACTIVE',
          endTime: { lte: now },
        },
        include: {
          listing: true,
        },
      });
    } catch (err) {
      return [];
    }

    const finalizedResults = [];

    for (const auction of expiredAuctions) {
      try {
        const result = await AuctionsService.finalizeSingleAuction(auction.id);
        finalizedResults.push(result);
      } catch (err: any) {
        // Log individual auction finalization errors without stopping loop
      }
    }

    return finalizedResults;
  }

  public static async finalizeSingleAuction(auctionId: string) {
    return await prisma.$transaction(async (tx) => {
      // Lock auction record
      const locked: any[] = await tx.$queryRaw`
        SELECT * FROM auctions WHERE id = ${auctionId} FOR UPDATE
      `;

      if (!locked || locked.length === 0) {
        throw new AppError('Auction not found.', 404, 'NOT_FOUND');
      }

      const auction = locked[0];

      if (auction.status === 'ENDED' || auction.status === 'SETTLED') {
        return { auctionId, status: auction.status, message: 'Already finalized' };
      }

      // Fetch highest non-invalidated bid
      const highestBid = await tx.bid.findFirst({
        where: { auctionId, isInvalidated: false },
        orderBy: { amount: 'desc' },
        include: { user: { select: { id: true, email: true, username: true } } },
      });

      let winnerId: string | null = null;
      let winningBidId: string | null = null;
      let orderCreated = false;

      if (highestBid) {
        winnerId = highestBid.userId;
        winningBidId = highestBid.id;

        // Check if order already exists (Idempotency - Section 14)
        const existingOrder = await tx.order.findUnique({
          where: { auctionId },
        });

        if (!existingOrder) {
          const listing = await tx.listing.findUnique({ where: { id: auction.listingId } });
          if (listing) {
            await tx.order.create({
              data: {
                auctionId,
                buyerId: winnerId,
                sellerId: listing.sellerId,
                totalAmount: highestBid.amount,
                currency: auction.currency || 'GHS',
                status: 'AWAITING_PAYMENT',
              },
            });
            orderCreated = true;
          }
        }
      }

      const finalStatus = winnerId ? 'ENDED' : 'CANCELLED';

      await tx.auction.update({
        where: { id: auctionId },
        data: {
          status: finalStatus,
          winnerId,
          winningBidId,
        },
      });

      // Send In-App Notification to winner if won
      if (winnerId) {
        await tx.notification.create({
          data: {
            userId: winnerId,
            title: 'Congratulations! You won the auction!',
            message: `You placed the winning bid of GHS ${highestBid?.amount}! Please complete checkout.`,
            type: 'WINNER',
            data: { auctionId },
          },
        });
      }

      await recordAuditLog({
        action: 'AUCTION_ENDED',
        resource: 'Auction',
        resourceId: auctionId,
        details: { winnerId, winningAmount: highestBid?.amount, orderCreated },
      });

      // Broadcast WS state update
      const io = getSocketIO();
      if (io) {
        io.to(`auction:${auctionId}`).emit('auction.ended', {
          auctionId,
          status: finalStatus,
          winnerId,
          winningAmount: highestBid?.amount,
        });
      }

      return { auctionId, status: finalStatus, winnerId, orderCreated };
    });
  }
}
