import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://smartechkenya.com'

  let products: { slug: string; updatedAt: Date }[] = []
  try {
    products = await prisma.product.findMany({
      where:  { isActive: true },
      select: { slug: true, updatedAt: true },
    })
  } catch {
    // DB not available at build time is fine
  }

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url:             `${baseUrl}/products/${p.slug}`,
    lastModified:    p.updatedAt,
    changeFrequency: 'weekly',
    priority:        0.8,
  }))

  return [
    { url: baseUrl,                                        lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${baseUrl}/products`,                          lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/products?category=TECH`,            lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/products?category=KITCHEN`,         lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/products?category=KITCHEN&subcategory=built-in`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/seller`,                            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...productUrls,
  ]
}

