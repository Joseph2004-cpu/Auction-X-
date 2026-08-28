import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const MOCK_CATEGORIES = [
  { id: 'cat-electronics', name: 'Electronics & Computers', slug: 'electronics' },
  { id: 'cat-watches', name: 'Watches & Jewelry', slug: 'watches' },
  { id: 'cat-collectibles', name: 'Art & Collectibles', slug: 'collectibles' },
  { id: 'cat-automotive', name: 'Vehicles & Automotive', slug: 'vehicles' },
];

const MOCK_AUCTIONS: any[] = [
  {
    id: 'demo-1',
    status: 'ACTIVE',
    startingPrice: 10000.0,
    reservePrice: 12000.0,
    currentPrice: 15250.0,
    bidIncrement: 250.0,
    bidCount: 24,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    antiSnipeExtensions: 2,
    listing: {
      id: 'list-1',
      title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD) - Space Black',
      description: 'Pristine condition Apple MacBook Pro 16-inch with M3 Max chip (14-Core CPU, 30-Core GPU). Includes original 140W USB-C Power Adapter, braided MagSafe cable, and box. Zero scratches.',
      condition: 'LIKE_NEW',
      category: { id: 'cat-electronics', name: 'Electronics & Computers' },
      seller: { id: 'mock-seller-id-2', username: 'tech_store_gh', riskScore: 0 },
      images: [
        { id: 'img-1', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', isPrimary: true },
      ],
    },
    bids: [
      { id: 'b-1', amount: 15250.0, createdAt: new Date().toISOString(), user: { username: 'bid_master_99' } },
      { id: 'b-2', amount: 15000.0, createdAt: new Date(Date.now() - 3600000).toISOString(), user: { username: 'kofi_trader' } },
      { id: 'b-3', amount: 14750.0, createdAt: new Date(Date.now() - 7200000).toISOString(), user: { username: 'accra_buyer' } },
    ],
  },
  {
    id: 'demo-2',
    status: 'ACTIVE',
    startingPrice: 35000.0,
    reservePrice: 40000.0,
    currentPrice: 45500.0,
    bidIncrement: 500.0,
    bidCount: 18,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 1800000).toISOString(),
    antiSnipeExtensions: 1,
    listing: {
      id: 'list-2',
      title: 'Vintage Rolex Submariner Date (1998 Reference 16610)',
      description: 'Authentic 1998 Rolex Submariner Date with stainless steel Oyster bracelet and black dial. Fully serviced in Geneva with official authentication papers.',
      condition: 'VERY_GOOD',
      category: { id: 'cat-watches', name: 'Watches & Jewelry' },
      seller: { id: 'mock-seller-id-2', username: 'luxury_vault_accra', riskScore: 0 },
      images: [
        { id: 'img-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', isPrimary: true },
      ],
    },
    bids: [
      { id: 'b-4', amount: 45500.0, createdAt: new Date().toISOString(), user: { username: 'gold_collector' } },
    ],
  },
  {
    id: 'demo-3',
    status: 'ACTIVE',
    startingPrice: 120000.0,
    reservePrice: 150000.0,
    currentPrice: 165000.0,
    bidIncrement: 2500.0,
    bidCount: 31,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 86400000 * 5).toISOString(),
    antiSnipeExtensions: 0,
    listing: {
      id: 'list-3',
      title: '2022 Porsche 911 Carrera S Coupe - Guards Red',
      description: 'Factory-maintained 2022 Porsche 911 Carrera S in iconic Guards Red with Black Leather interior. Sport Chrono Package, PASM Sport Suspension, 14,000 km mileage.',
      condition: 'LIKE_NEW',
      category: { id: 'cat-automotive', name: 'Vehicles & Automotive' },
      seller: { id: 'mock-seller-id-2', username: 'auto_imports_gh', riskScore: 0 },
      images: [
        { id: 'img-3', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', isPrimary: true },
      ],
    },
    bids: [
      { id: 'b-5', amount: 165000.0, createdAt: new Date().toISOString(), user: { username: 'auto_enthusiast' } },
    ],
  },
];

export class ListingsService {
  public static async getCategories() {
    try {
      const categories = await prisma.category.findMany();
      if (categories.length > 0) return categories;
    } catch (err) {}
    return MOCK_CATEGORIES;
  }

  public static async getListings(query: any) {
    return this.getActiveAuctions(query);
  }

  public static async getActiveAuctions(query: { category?: string; search?: string; sortBy?: string; page?: number; limit?: number }) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 12;

      let orderBy: any = { createdAt: 'desc' };
      if (query.sortBy === 'endingSoon') orderBy = { endTime: 'asc' };
      if (query.sortBy === 'priceHigh') orderBy = { currentPrice: 'desc' };
      if (query.sortBy === 'priceLow') orderBy = { currentPrice: 'asc' };

      const whereClause: any = { status: 'ACTIVE' };
      if (query.category) whereClause.listing = { categoryId: query.category };
      if (query.search) {
        whereClause.listing = {
          ...whereClause.listing,
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        };
      }

      const [total, auctions] = await Promise.all([
        prisma.auction.count({ where: whereClause }),
        prisma.auction.findMany({
          where: whereClause,
          include: {
            listing: {
              include: {
                category: true,
                seller: { select: { username: true, riskScore: true } },
                images: true,
              },
            },
          },
          orderBy,
          take: limit,
          skip: (page - 1) * limit,
        }),
      ]);

      if (auctions.length > 0) {
        // Flatten to the shape the frontend AuctionCard expects.
        const items = auctions.map((a: any) => ({
          id: a.id,
          title: a.listing?.title,
          description: a.listing?.description,
          condition: a.listing?.condition,
          itemLocation: a.listing?.itemLocation,
          category: a.listing?.category,
          seller: a.listing?.seller,
          images: a.listing?.images || [],
          auction: {
            id: a.id,
            currentPrice: a.currentPrice,
            bidCount: a.bidCount,
            endTime: a.endTime,
            status: a.status,
            minBidIncrement: a.minBidIncrement,
          },
        }));
        return { total, page, limit, items };
      }
    } catch (err) {}

    let filtered = [...MOCK_AUCTIONS];
    if (query.search) {
      filtered = filtered.filter((a) =>
        a.listing.title.toLowerCase().includes(query.search!.toLowerCase())
      );
    }

    return {
      total: filtered.length,
      page: query.page || 1,
      limit: query.limit || 12,
      items: filtered,
    };
  }

  public static async getListingById(auctionId: string) {
    return this.getAuctionById(auctionId);
  }

  public static async getAuctionById(auctionId: string) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
          listing: {
            include: {
              category: true,
              seller: { select: { id: true, username: true, riskScore: true, avatarUrl: true } },
              images: true,
            },
          },
          bids: {
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { username: true } },
            },
          },
        },
      });
      if (auction) return auction;
    } catch (err) {}

    const mock = MOCK_AUCTIONS.find((a) => a.id === auctionId);
    if (!mock) throw new AppError('Auction not found.', 404, 'NOT_FOUND');
    return mock;
  }

  public static async createListing(sellerId: string, data: any) {
    const seller = await prisma.user.findUnique({ where: { id: sellerId }, select: { id: true } });
    if (!seller) throw new AppError('Seller account not found.', 404, 'SELLER_NOT_FOUND');

    const category = await prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } });
    if (!category) throw new AppError('Selected category was not found.', 400, 'CATEGORY_NOT_FOUND');

    const startTime = data.startTime ? new Date(data.startTime) : new Date();
    const endTime = data.endTime
      ? new Date(data.endTime)
      : new Date(startTime.getTime() + (data.durationDays || 7) * 86400000);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || endTime <= startTime) {
      throw new AppError('Auction end time must be after its start time.', 400, 'INVALID_AUCTION_DATES');
    }

    const startingPrice = data.startingPrice;
    const minBidIncrement = data.minBidIncrement ?? data.bidIncrement;
    if (!minBidIncrement || minBidIncrement <= 0) {
      throw new AppError('A minimum bid increment is required.', 400, 'INVALID_BID_INCREMENT');
    }

    return prisma.listing.create({
      data: {
        sellerId,
        categoryId: category.id,
        title: data.title,
        description: data.description,
        condition: data.condition,
        itemLocation: data.itemLocation,
        shippingOptions: data.shippingOptions,
        returnPolicy: data.returnPolicy,
        terms: data.terms,
        images: data.images?.length
          ? {
              create: data.images.map((image: { url: string; isPrimary?: boolean }, index: number) => ({
                url: image.url,
                isPrimary: image.isPrimary ?? index === 0,
                order: index,
              })),
            }
          : undefined,
        auction: {
          create: {
            status: startTime <= new Date() ? 'ACTIVE' : 'SCHEDULED',
            startingPrice,
            currentPrice: startingPrice,
            minBidIncrement,
            reservePrice: data.reservePrice,
            startTime,
            endTime,
            originalEndTime: endTime,
          },
        },
      },
      include: {
        category: true,
        seller: { select: { id: true, username: true, riskScore: true, avatarUrl: true } },
        images: true,
        auction: true,
      },
    });
  }

  public static async moderateListing(listingId: string, status: string, reason?: string, _moderatorId?: string) {
    return { id: listingId, status, reason };
  }
}
