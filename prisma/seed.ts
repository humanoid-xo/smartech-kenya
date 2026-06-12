import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: 'MIKA Side-by-Side No Frost Fridge 442L Inverter',
    slug: 'mika-side-by-side-fridge-442l-inverter',
    sku: 'MRNF2D442XLBV', brand: 'Mika', category: 'KITCHEN' as const,
    subcategory: 'fridges', price: 89999, comparePrice: 99999,
    isFeatured: true, stock: 12,
    images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80'],
    description: 'AI Inverter side-by-side no-frost fridge, 442L. 2 independent digitally controlled zones — fridge & freezer. Dedicated crisper zone for fruits & nuts. Toughened glass shelves, door balconies. Comes with twist ice tray, cool pack and wine rack. Wide voltage tolerance AC 180–250V.',
    specifications: { capacity: '442L', freezer: '151L', fridge: '291L', power: '150W', gas: 'R600a', voltage: 'AC 180–250V', dimensions: '910×590×1770mm' },
    features: ['AI Inverter Compressor', 'No Frost Technology', '2 Independent Cooling Zones', 'Crisper Zone for Fruits & Nuts', 'Toughened Glass Shelves'],
    tags: ['fridge', 'no-frost', 'inverter', 'mika'],
  },
  {
    name: 'MIKA Water Dispenser Hot & Electric Cooling Cabinet White/Black',
    slug: 'mika-water-dispenser-hot-electric-mwd2304wb',
    sku: 'MWD2304WB', brand: 'Mika', category: 'KITCHEN' as const,
    subcategory: 'water-dispensers', price: 14999, comparePrice: 17999,
    isFeatured: false, stock: 20,
    images: ['https://images.unsplash.com/photo-1548277539-ee5c7d9f4b3c?w=800&q=80'],
    description: 'Standing hot & electric cooling water dispenser. Stainless steel hot water tank ensures purity and hygiene. Child safety lock on hot water tap. Easy press taps, hot water power switch, and storage cabinet.',
    specifications: { power: '485W', heatingCapacity: '5L/H', coolingCapacity: '1L/H', hotTank: '0.6L', coldTank: '0.6L', dimensions: '270×290×858mm', color: 'White & Black' },
    features: ['Hot & Electric Cooling', 'Stainless Steel Hot Tank', 'Child Safety Lock', 'Storage Cabinet', 'Easy Press Taps'],
    tags: ['water dispenser', 'mika'],
  },
  {
    name: 'MIKA Water Dispenser 3-Tap Hot Normal & Electric Cooling Cabinet Black/Grey',
    slug: 'mika-water-dispenser-3tap-mwd2307bg',
    sku: 'MWD2307BG', brand: 'Mika', category: 'KITCHEN' as const,
    subcategory: 'water-dispensers', price: 17999, comparePrice: 20999,
    isFeatured: false, stock: 15,
    images: ['https://images.unsplash.com/photo-1548277539-ee5c7d9f4b3c?w=800&q=80'],
    description: 'Standing 3-tap dispenser — hot, normal, and electric cooling. Larger 0.8L stainless steel hot tank. Child safety lock, hot water power switch, and storage cabinet.',
    specifications: { power: '565W', heatingCapacity: '5L/H', coolingCapacity: '1L/H', hotTank: '0.8L', coldTank: '0.6L', dimensions: '300×330×1010mm', color: 'Black & Grey' },
    features: ['3 Taps — Hot / Normal / Cold', 'Stainless Steel Hot Tank', 'Child Safety Lock', 'Storage Cabinet'],
    tags: ['water dispenser', 'mika'],
  },
  {
    name: 'MIKA Bottom Load Water Dispenser Compressor Cooling 3-Tap Black/Silver',
    slug: 'mika-bottom-load-dispenser-mwdb2804bs',
    sku: 'MWDB2804BS', brand: 'Mika', category: 'KITCHEN' as const,
    subcategory: 'water-dispensers', price: 22999, comparePrice: 27999,
    isFeatured: true, stock: 10,
    images: ['https://images.unsplash.com/photo-1548277539-ee5c7d9f4b3c?w=800&q=80'],
    description: 'Premium bottom-load dispenser — no heavy lifting. Compressor cooling (2L/h) for faster, colder water. Concealed bottle compartment. Stainless steel hot tank, child safety lock, power protection fuse.',
    specifications: { power: '585W', heatingPower: '500W', coolingPower: '85W', heatingCapacity: '5L/h', coolingCapacity: '2L/h', dimensions: '310×350×1035mm', color: 'Black & Silver' },
    features: ['Bottom Load — No Heavy Lifting', 'Compressor Cooling 2L/h', 'Concealed Bottle Cabinet', 'Stainless Steel Hot Tank', 'Child Safety Lock'],
    tags: ['water dispenser', 'bottom load', 'mika'],
  },
  {
    name: 'MIKA 8kg Front Load Inverter Washing Machine Dark Silver',
    slug: 'mika-8kg-front-load-inverter-washer',
    sku: 'MWAF13408DSV', brand: 'Mika', category: 'KITCHEN' as const,
    subcategory: 'washing-machines', price: 62999, comparePrice: 74999,
    isFeatured: true, stock: 8,
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80'],
    description: 'A+++ rated front-load inverter washing machine. Brushless motor with 10-year warranty. 14 programs including Spa Care steam (kills allergens up to 99.99%), 59-min quick wash, night wash, delay start up to 24hrs, self-diagnosis, child lock. 1400 RPM spin.',
    specifications: { capacity: '8kg', spinSpeed: '1400 RPM', programs: '14', power: '1950W', voltage: 'AC 220–240V/50Hz', dimensions: '595×600×850mm' },
    features: ['Brushless Inverter Motor — 10yr Warranty', 'A+++ Energy Rating', 'Spa Care Steam Wash', '59 Min Quick Wash', 'Night Wash Mode', 'Delay Start up to 24Hrs'],
    tags: ['washing machine', 'front load', 'inverter', 'mika'],
  },
  {
    name: 'Ramtons Twin Tub Semi-Automatic 10kg Washer 6kg Spin',
    slug: 'ramtons-twin-tub-semi-auto-rw215',
    sku: 'RW215', brand: 'Ramtons', category: 'KITCHEN' as const,
    subcategory: 'washing-machines', price: 18500, comparePrice: 21000,
    isFeatured: false, stock: 18,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    description: 'Twin-tub semi-automatic washer — 10kg wash, 6kg spin. Air-dry spins without heat for up to 80% dryness. Water-efficient design. Manual timer, normal/heavy load selector, gravity drain with lint filter, rat-proof base.',
    specifications: { washCapacity: '10kg', spinCapacity: '6kg', dryingEfficiency: 'Up to 80%' },
    features: ['10kg Wash + 6kg Spin', 'Air Dry — No Heat', 'Water-Efficient Twin Tub', 'Gravity Drain with Lint Filter'],
    tags: ['washing machine', 'semi-automatic', 'ramtons'],
  },
  {
    name: 'Hisense 5-Burner 90cm Built-In Gas Hob Black Stainless Steel',
    slug: 'hisense-5-burner-90cm-gas-hob',
    sku: 'HGH951BS01', brand: 'Hisense', category: 'KITCHEN' as const,
    subcategory: 'built-in', price: 34999, comparePrice: 40999,
    isFeatured: true, stock: 6,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    description: '90cm 5-burner built-in gas hob. Cast iron pan supports. Auto electronic ignition and flame failure safety on all burners. Total 10.6kW. Black stainless steel finish. 12-month warranty.',
    specifications: { burners: '5', totalPower: '10.6kW', dimensions: 'W860×D510mm', cutOut: 'W830×D490mm', warranty: '12 months' },
    features: ['5 Gas Burners', 'Cast Iron Pan Supports', 'Auto Electronic Ignition', 'Flame Failure Safety Device'],
    tags: ['hob', 'gas', 'hisense'],
  },
  {
    name: 'Hisense 4-Burner 60cm Built-In Gas Hob Black Glass',
    slug: 'hisense-4-burner-60cm-gas-hob',
    sku: 'HHU60GAGB', brand: 'Hisense', category: 'KITCHEN' as const,
    subcategory: 'built-in', price: 24999, comparePrice: 29999,
    isFeatured: false, stock: 9,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    description: '60cm 4-burner built-in gas hob with black glass finish. Auto ignition and flame failure safety. Cast iron pan supports. Burner outputs: FL 3.6kW, RL 1.75kW, FR 1.0kW, RR 1.75kW. 12-month warranty.',
    specifications: { burners: '4', frontLeft: '3.6kW', rearLeft: '1.75kW', frontRight: '1.0kW', rearRight: '1.75kW', dimensions: 'W600×D520×H89mm', warranty: '12 months' },
    features: ['4 Gas Burners', 'Black Glass Finish', 'Auto Electronic Ignition', 'Flame Failure Safety Device'],
    tags: ['hob', 'gas', 'hisense'],
  },
  {
    name: 'Hisense 60cm Vertical Extractor Hood Black Glass',
    slug: 'hisense-60cm-vertical-hood',
    sku: 'HAH602BG01', brand: 'Hisense', category: 'KITCHEN' as const,
    subcategory: 'built-in', price: 19999, comparePrice: 24999,
    isFeatured: false, stock: 7,
    images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80'],
    description: '60cm vertical extractor hood. Touch controls, Wi-Fi. 470m³/h extraction, 4 fan speeds, LED lighting (2×3W), aluminium filter. Max 56dB. Black glass, 12-month warranty.',
    specifications: { width: '60cm', extraction: '470 m³/h', fanSpeeds: '4', noise: '56dB max', warranty: '12 months' },
    features: ['Touch Control', 'Wi-Fi Function', '470m³/h Air Extraction', '4 Fan Speed Levels', 'LED Lighting'],
    tags: ['hood', 'extractor', 'hisense'],
  },
  {
    name: 'Hisense 90cm Vertical Extractor Hood Black Glass',
    slug: 'hisense-90cm-vertical-hood',
    sku: 'HAH902BG01', brand: 'Hisense', category: 'KITCHEN' as const,
    subcategory: 'built-in', price: 25999, comparePrice: 30999,
    isFeatured: true, stock: 5,
    images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80'],
    description: '90cm vertical extractor hood. Touch controls, Wi-Fi. 750m³/h extraction, 4 fan speeds, LED lighting, aluminium filters. Max 56dB. Black glass, 12-month warranty.',
    specifications: { width: '90cm', extraction: '750 m³/h', fanSpeeds: '4', noise: '56dB max', warranty: '12 months' },
    features: ['Touch Control', 'Wi-Fi Function', '750m³/h Air Extraction', '4 Fan Speed Levels', 'LED Lighting'],
    tags: ['hood', 'extractor', 'hisense'],
  },
  {
    name: "Samsung 55\" 4K QLED Smart TV",
    slug: 'samsung-55-4k-qled-smart-tv',
    sku: 'QE55Q60C', brand: 'Samsung', category: 'AUDIO_TV' as const,
    subcategory: 'smart-tvs', price: 89999, comparePrice: 109999,
    isFeatured: true, stock: 10,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800&q=80'],
    description: '55-inch 4K QLED Smart TV. Quantum Dot technology for vivid billion-colour picture. Quantum HDR, Object Tracking Sound 20W, AirSlim design. Google Assistant and Alexa built-in. Tizen OS.',
    specifications: { screenSize: '55"', resolution: '4K UHD 3840×2160', technology: 'QLED', sound: '20W Object Tracking', os: 'Tizen' },
    features: ['Quantum Dot Technology', '4K UHD Resolution', 'Quantum HDR', 'Object Tracking Sound', 'Google Assistant & Alexa'],
    tags: ['tv', '4k', 'qled', 'samsung'],
  },
  {
    name: 'Samsung Galaxy A55 5G 8GB/256GB',
    slug: 'samsung-galaxy-a55-5g-256gb',
    sku: 'SMA556B', brand: 'Samsung', category: 'SMARTPHONES' as const,
    subcategory: 'phones', price: 54999, comparePrice: 62000,
    isFeatured: true, stock: 25,
    images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80'],
    description: 'Galaxy A55 5G — 6.6" FHD+ Super AMOLED 120Hz display. 50MP triple camera. 5000mAh battery. 8GB RAM, 256GB storage. IP67 water resistant. Samsung Knox security.',
    specifications: { display: '6.6" FHD+ Super AMOLED 120Hz', processor: 'Exynos 1480', ram: '8GB', storage: '256GB', camera: '50MP + 12MP + 5MP', battery: '5000mAh' },
    features: ['5G Connectivity', '50MP Triple Camera', '120Hz Super AMOLED', '5000mAh Battery', 'IP67 Water Resistance'],
    tags: ['phone', 'samsung', '5g'],
  },
  {
    name: 'HP 15 Laptop Intel Core i5 8GB RAM 512GB SSD',
    slug: 'hp-15-laptop-i5-8gb-512gb',
    sku: 'HP15FD0098', brand: 'HP', category: 'LAPTOPS' as const,
    subcategory: 'laptops', price: 74999, comparePrice: 84999,
    isFeatured: true, stock: 14,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
    description: 'HP 15 — Intel Core i5 12th Gen, 8GB DDR4 RAM, 512GB SSD. 15.6" Full HD anti-glare display. Windows 11 Home. HP Fast Charge (50% in 45min). Wi-Fi 6. Up to 8hrs battery.',
    specifications: { display: '15.6" FHD 1920×1080', processor: 'Intel Core i5-1235U', ram: '8GB DDR4', storage: '512GB SSD', os: 'Windows 11 Home', weight: '1.75kg' },
    features: ['Intel Core i5 12th Gen', '512GB Fast SSD', 'Windows 11 Home', 'HP Fast Charge', 'Wi-Fi 6'],
    tags: ['laptop', 'hp', 'intel i5'],
  },
];

async function main() {
  console.log('Seeding Smartech Kenya…\n');

  const hashedPw = await bcrypt.hash('SmartechAdmin2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'smartechkenya01@gmail.com' },
    update: {},
    create: { email: 'smartechkenya01@gmail.com', name: 'Smartech Kenya', hashedPassword: hashedPw, isSeller: true, isAdmin: true },
  });
  console.log(`Admin: ${admin.email}\n`);

  await prisma.product.deleteMany({});
  console.log('Cleared existing products.\n');

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name, slug: p.slug, sku: p.sku, brand: p.brand,
        category: p.category, subcategory: p.subcategory,
        price: p.price, comparePrice: p.comparePrice,
        description: p.description, images: p.images,
        features: p.features as any, specifications: p.specifications as any,
        tags: p.tags, isFeatured: p.isFeatured, isActive: true,
        stock: p.stock, sellerId: admin.id,
      },
    });
    console.log(`  ✓ ${p.sku}  ${p.name}`);
  }

  console.log(`\nDone: ${PRODUCTS.length} products. Upload photos via /admin`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
