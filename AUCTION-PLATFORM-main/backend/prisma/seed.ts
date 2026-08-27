import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Seed Roles
  const roles = ['GUEST', 'BUYER', 'SELLER', 'MODERATOR', 'ADMIN'];
  const roleMap: Record<string, any> = {};

  for (const roleName of roles) {
    roleMap[roleName] = await prisma.role.upsert({
      where: { name: roleName as any },
      update: {},
      create: {
        name: roleName as any,
        description: `System role for ${roleName}`,
      },
    });
  }

  // 2. Seed Permissions
  const permissionsList = [
    { code: 'auctions:create', description: 'Create auction listings' },
    { code: 'auctions:bid', description: 'Place bids on active auctions' },
    { code: 'listings:moderate', description: 'Approve or reject listings' },
    { code: 'users:manage', description: 'Administrative user management' },
    { code: 'disputes:resolve', description: 'Resolve buyer/seller disputes' },
  ];

  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });

    // Assign all permissions to ADMIN
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleMap.ADMIN.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roleMap.ADMIN.id,
        permissionId: perm.id,
      },
    });
  }

  // 3. Seed Password Hash
  const defaultPasswordHash = await argon2.hash('Password123!', {
    type: argon2.argon2id,
  });

  // 4. Seed Demo Users (Section 91 & 92 of Master Prompt)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@auctionx.com' },
    update: {},
    create: {
      email: 'admin@auctionx.com',
      username: 'system_admin',
      passwordHash: defaultPasswordHash,
      firstName: 'Platform',
      lastName: 'Administrator',
      isEmailVerified: true,
      roles: {
        create: [
          { roleId: roleMap.ADMIN.id },
          { roleId: roleMap.MODERATOR.id },
        ],
      },
    },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@auctionx.com' },
    update: {},
    create: {
      email: 'seller@auctionx.com',
      username: 'tech_store_gh',
      passwordHash: defaultPasswordHash,
      firstName: 'Kwame',
      lastName: 'Mensah',
      isEmailVerified: true,
      roles: {
        create: [
          { roleId: roleMap.SELLER.id },
          { roleId: roleMap.BUYER.id },
        ],
      },
    },
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@auctionx.com' },
    update: {},
    create: {
      email: 'buyer@auctionx.com',
      username: 'bid_master_99',
      passwordHash: defaultPasswordHash,
      firstName: 'Abena',
      lastName: 'Osei',
      isEmailVerified: true,
      roles: {
        create: [{ roleId: roleMap.BUYER.id }],
      },
    },
  });

  // 5. Seed Categories
  const categories = [
    { name: 'Electronics & Gadgets', slug: 'electronics' },
    { name: 'Antiques & Collectibles', slug: 'collectibles' },
    { name: 'Vehicles & Automotive', slug: 'vehicles' },
    { name: 'Fashion & Luxury Watches', slug: 'fashion' },
    { name: 'Fine Art & Sculptures', slug: 'art' },
  ];

  const categoryMap: Record<string, any> = {};
  for (const cat of categories) {
    categoryMap[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 6. Seed Demo Listings & Active Auctions
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const demoListingsData = [
    {
      title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD) - Space Black',
      description: 'Brand new, sealed in box. Pristine condition with 1-year AppleCare warranty.',
      condition: 'NEW',
      categorySlug: 'electronics',
      startingPrice: 15000.0,
      minIncrement: 250.0,
      status: 'ACTIVE',
      endTime: tomorrow,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Vintage Rolex Submariner Date (1998 Reference 16610)',
      description: 'Authentic vintage Rolex Submariner stainless steel dive watch with original box and papers.',
      condition: 'LIKE_NEW',
      categorySlug: 'fashion',
      startingPrice: 45000.0,
      minIncrement: 500.0,
      status: 'ACTIVE',
      endTime: nextWeek,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'Sony Alpha A7 IV Full-Frame Mirrorless Camera + 24-70mm G Master Lens',
      description: 'Lightly used photography kit with low shutter count (< 2000 actuations). Comes with two batteries.',
      condition: 'GOOD',
      categorySlug: 'electronics',
      startingPrice: 12000.0,
      minIncrement: 200.0,
      status: 'ACTIVE',
      endTime: tomorrow,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60',
    },
  ];

  for (const item of demoListingsData) {
    const listing = await prisma.listing.create({
      data: {
        sellerId: sellerUser.id,
        categoryId: categoryMap[item.categorySlug].id,
        title: item.title,
        description: item.description,
        condition: item.condition,
        itemLocation: 'Accra, Ghana',
        shippingOptions: 'Express Courier & Pickup Available',
        images: {
          create: [{ url: item.image, thumbnail: item.image, isPrimary: true }],
        },
        auction: {
          create: {
            status: item.status as any,
            startingPrice: item.startingPrice,
            currentPrice: item.startingPrice,
            minBidIncrement: item.minIncrement,
            currency: 'GHS',
            startTime: now,
            endTime: item.endTime,
            originalEndTime: item.endTime,
          },
        },
      },
      include: { auction: true },
    });

    // Seed initial bid
    if (listing.auction) {
      const initialBidAmount = item.startingPrice + item.minIncrement;
      const bid = await prisma.bid.create({
        data: {
          auctionId: listing.auction.id,
          userId: buyerUser.id,
          amount: initialBidAmount,
          currency: 'GHS',
        },
      });

      await prisma.auction.update({
        where: { id: listing.auction.id },
        data: {
          currentPrice: initialBidAmount,
          bidCount: 1,
          winningBidId: bid.id,
          winnerId: buyerUser.id,
        },
      });
    }
  }

  console.log('✅ Database Seeding Completed Successfully!');
  console.log('-------------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('  Admin User  : admin@auctionx.com  / Password123!');
  console.log('  Seller User : seller@auctionx.com / Password123!');
  console.log('  Buyer User  : buyer@auctionx.com  / Password123!');
  console.log('-------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
