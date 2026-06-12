// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-runner.ts
// Or add to package.json: "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed-runner.ts"

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Smartech Kenya database...\n');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartechkenya.com';
  const adminPass  = process.env.ADMIN_SECRET || 'smartech-admin-2025';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  let admin;
  if (!existing) {
    admin = await prisma.user.create({
      data: {
        email:          adminEmail,
        name:           'Smartech Admin',
        hashedPassword: await bcrypt.hash(adminPass, 12),
        isAdmin:        true,
        isSeller:       true,
        phone:          '+254746722417',
      },
    });
    console.log('✓ Admin user created:', adminEmail);
  } else {
    admin = existing;
    console.log('✓ Admin user already exists:', adminEmail);
  }

  // Seed products
  const PRODUCTS = [
    {
      name: 'MIKA Side-by-Side No Frost Fridge 442L Inverter', slug: 'mika-side-by-side-fridge-442l', sku: 'MRNF2D442XLBV',
      brand: 'Mika', category: 'KITCHEN' as const, subcategory: 'fridges', price: 89999, comparePrice: 99999,
      isFeatured: true, stock: 12,
      images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80'],
      description: 'AI Inverter side-by-side no-frost fridge 442L. 2 independent cooling zones.',
      specifications: {}, features: [], tags: ['fridge', 'mika'],
    },
    {
      name: 'MIKA 8kg Front Load Inverter Washing Machine', slug: 'mika-8kg-front-load-washer', sku: 'MWAF13408DSV',
      brand: 'Mika', category: 'KITCHEN' as const, subcategory: 'washing-machines', price: 62999, comparePrice: 74999,
      isFeatured: true, stock: 8,
      images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80'],
      description: 'A+++ rated front-load inverter. Brushless motor 10yr warranty. Steam wash, 1400 RPM.',
      specifications: {}, features: [], tags: ['washing machine', 'mika'],
    },
    {
      name: 'Hisense 43" 4K UHD Smart TV VIDAA', slug: 'hisense-43-4k-smart-tv', sku: 'HSTV43A7200',
      brand: 'Hisense', category: 'AUDIO_TV' as const, subcategory: 'smart-tvs', price: 38999, comparePrice: 44999,
      isFeatured: true, stock: 15,
      images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80'],
      description: '43" 4K UHD Smart TV. VIDAA OS, Dolby Audio, DTS Virtual:X, Voice Assistant.',
      specifications: {}, features: [], tags: ['tv', 'hisense'],
    },
    {
      name: 'Samsung Galaxy A55 5G 8GB/256GB', slug: 'samsung-galaxy-a55-5g', sku: 'SMA556BLBCAFR',
      brand: 'Samsung', category: 'SMARTPHONES' as const, subcategory: 'android', price: 54999, comparePrice: 59999,
      isFeatured: true, stock: 20,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
      description: 'Galaxy A55 5G. 6.6" Super AMOLED, 50MP OIS camera, 5000mAh, IP67.',
      specifications: {}, features: [], tags: ['samsung', 'smartphone', '5g'],
    },
    {
      name: 'HP 15 Laptop Intel Core i5 8GB/512GB SSD', slug: 'hp-15-laptop-i5-512ssd', sku: 'HP15DY5013',
      brand: 'HP', category: 'LAPTOPS' as const, subcategory: 'laptops', price: 74999, comparePrice: 84999,
      isFeatured: false, stock: 10,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
      description: 'HP 15 with Intel Core i5-1235U, 8GB RAM, 512GB SSD, Windows 11.',
      specifications: {}, features: [], tags: ['laptop', 'hp', 'i5'],
    },
    {
      name: 'Ramtons Twin Tub Semi-Auto Washer 10kg', slug: 'ramtons-twin-tub-washer-10kg', sku: 'RW215',
      brand: 'Ramtons', category: 'KITCHEN' as const, subcategory: 'washing-machines', price: 18500, comparePrice: 21000,
      isFeatured: false, stock: 18,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
      description: '10kg wash + 6kg spin. Semi-automatic twin tub.',
      specifications: {}, features: [], tags: ['washing machine', 'ramtons'],
    },
    {
      name: 'MIKA Water Dispenser Hot & Cold Cabinet', slug: 'mika-water-dispenser-hot-cold', sku: 'MWD2304WB',
      brand: 'Mika', category: 'KITCHEN' as const, subcategory: 'water-dispensers', price: 14999, comparePrice: 17999,
      isFeatured: false, stock: 20,
      images: ['https://images.unsplash.com/photo-1548277539-ee5c7d9f4b3c?w=800&q=80'],
      description: 'Hot & electric cooling water dispenser with storage cabinet.',
      specifications: {}, features: [], tags: ['water dispenser', 'mika'],
    },
    {
      name: 'LG 260L Double Door No Frost Fridge', slug: 'lg-260l-double-door-fridge', sku: 'LGGL291BVBN',
      brand: 'LG', category: 'KITCHEN' as const, subcategory: 'fridges', price: 59999, comparePrice: 68000,
      isFeatured: false, stock: 7,
      images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80'],
      description: 'LG 260L no frost fridge. Smart Inverter Compressor, Door Cooling+.',
      specifications: {}, features: [], tags: ['fridge', 'lg'],
    },
  ];

  let created = 0, skipped = 0;
  for (const p of PRODUCTS) {
    const exists = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (exists) { skipped++; continue; }
    await prisma.product.create({
      data: { ...p, sellerId: admin.id, isActive: true, metaTitle: p.name, metaDescription: p.description },
    });
    created++;
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   Products created: ${created}`);
  console.log(`   Products skipped (already exist): ${skipped}`);
  console.log(`\nYour homepage should now show products at http://localhost:3000`);
}

main()
  .catch(e => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
