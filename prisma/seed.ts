import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Smartech Kenya…');

  const hashedPw = await bcrypt.hash('SmartechAdmin2024!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'smartechkenya01@gmail.com' },
    update: {},
    create: {
      email:          'smartechkenya01@gmail.com',
      name:           'Smartech Kenya',
      hashedPassword: hashedPw,
      isSeller:       true,
      isAdmin:        true,
    },
  });
  console.log(`Admin: ${admin.email}`);

  // ── Keep exactly 2 test products with CORRECT images ──────────────────────
  const products = [
    {
      name:        'MIKA Side-by-Side No Frost Fridge 442L Inverter',
      slug:        'mika-side-by-side-fridge-442l-inverter',
      sku:         'MRNF2D442XLBV',
      brand:       'Mika',
      category:    'KITCHEN' as const,
      subcategory: 'fridges',
      price:       89999,
      comparePrice:99999,
      isFeatured:  true,
      stock:       12,
      // Correct: single-door fridge image
      images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80'],
      description: 'AI Inverter side-by-side no-frost fridge with 442L capacity. 2 independent digitally controlled zones, crisper zone for fruits & nuts, toughened glass shelves, door balconies. Comes with twist ice tray, cool pack and wine rack. Wide voltage tolerance AC 180–250V.',
      specifications: { capacity: '442L', dimensions: '910×590×1770mm', power: '150W', gas: 'R600a', voltage: 'AC 180–250V', freezer: '151L', fridge: '291L' },
      features: ['AI Inverter Compressor', 'No Frost Technology', '2 Independent Cooling Zones', 'Crisper Zone for Fruits & Nuts', 'Toughened Glass Shelves'],
      tags: ['fridge', 'no-frost', 'inverter', 'mika'],
    },
    {
      name:        'MIKA 8kg Front Load Inverter Washing Machine Dark Silver',
      slug:        'mika-8kg-front-load-inverter-washing-machine',
      sku:         'MWAF13408DSV',
      brand:       'Mika',
      category:    'KITCHEN' as const,
      subcategory: 'washing-machines',
      price:       62999,
      comparePrice:74999,
      isFeatured:  true,
      stock:       8,
      // Correct: front-load washing machine image
      images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80'],
      description: 'A+++ rated front-load inverter washing machine. Brushless motor with 10-year warranty. 14 programs, Spa Care steam wash kills allergens up to 99.99%, 59-min quick wash, night wash mode, delay start up to 24hrs, self-diagnosis, and child lock. 1400 RPM spin speed.',
      specifications: { capacity: '8kg', spinSpeed: '1400 RPM', programs: '14', power: '1950W', voltage: 'AC 220–240V/50Hz', dimensions: '595×600×850mm', weight: '65kg net' },
      features: ['Brushless Inverter Motor (10yr warranty)', 'A+++ Energy Rating', 'Spa Care Steam Wash', '59 Min Quick Wash', 'Night Wash Mode', 'Delay Start up to 24Hrs'],
      tags: ['washing machine', 'front load', 'inverter', '8kg', 'mika'],
    },
  ];

  // Delete all existing products first (clean slate)
  await prisma.product.deleteMany({});
  console.log('Cleared existing products.');

  for (const p of products) {
    await prisma.product.create({
      data: {
        name:           p.name,
        slug:           p.slug,
        sku:            p.sku,
        brand:          p.brand,
        category:       p.category,
        subcategory:    p.subcategory,
        price:          p.price,
        comparePrice:   p.comparePrice,
        description:    p.description,
        images:         p.images,
        features:       p.features as any,
        specifications: p.specifications as any,
        tags:           p.tags,
        isFeatured:     p.isFeatured,
        isActive:       true,
        stock:          p.stock,
        sellerId:       admin.id,
      },
    });
    console.log(`  + ${p.name} [${p.sku}]`);
  }

  console.log('\nDone: 2 test products seeded. Add real products via /admin page.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
