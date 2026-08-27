import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const MOCK_CATEGORIES = [
  { id: 'cat-electronics', name: 'Electronics & Computers', slug: 'electronics', description: 'Phones, laptops, cameras, gadgets', parentId: null, createdAt: new Date(), children: [] },
  { id: 'cat-watches', name: 'Watches & Jewelry', slug: 'watches', description: 'Watches and jewelry items', parentId: null, createdAt: new Date(), children: [] },
  { id: 'cat-collectibles', name: 'Art & Collectibles', slug: 'collectibles', description: 'Art, antiques and collectibles', parentId: null, createdAt: new Date(), children: [] },
  { id: 'cat-automotive', name: 'Vehicles & Automotive', slug: 'vehicles', description: 'Cars, motorcycles and parts', parentId: null, createdAt: new Date(), children: [] },
  { id: 'cat-fashion', name: 'Fashion & Apparel', slug: 'fashion', description: 'Clothing, shoes and accessories', parentId: null, createdAt: new Date(), children: [] },
];

export class CategoriesService {
  public static async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: true,
        },
        orderBy: { name: 'asc' },
      });
      if (categories.length > 0) return categories;
    } catch (err) {
      // Fallback when DB is offline
    }
    return MOCK_CATEGORIES;
  }

  public static async createCategory(data: { name: string; slug: string; description?: string; parentId?: string }) {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) {
      throw new AppError('Category slug already exists.', 400, 'CATEGORY_SLUG_EXISTS');
    }

    return await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
      },
    });
  }
}
