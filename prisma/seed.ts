
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ── Unsplash image banks by category ─────────────────────────────────────────
const IMG = {
  fridge:    ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
              'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80'],
  washer:    ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
              'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80'],
  dispenser: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80',
              'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'],
  hob:       ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
              'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80'],
  hood:      ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
              'https://images.unsplash.com/photo-1556909048-f56e5f9b1b19?w=800&q=80'],
  tv:        ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800&q=80',
              'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80'],
  phone:     ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
              'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'],
  laptop:    ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
              'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'],
  microwave: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'],
  ac:        ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'],
}

// ── Products adapted from Urban Appliances RSS ────────────────────────────────
const PRODUCTS = [
  // ── KITCHEN ─────────────────────────────────────────────────────────────────
  {
    name:        'MIKA Side-by-Side No Frost Fridge 442L Inverter MRNF2D442XLBV',
    slug:        'mika-side-by-side-fridge-442l-inverter-mrnf2d442xlbv',
    sku:         'MRNF2D442XLBV',
    brand:       'Mika',
    category:    'KITCHEN' as const,
    subcategory: 'fridges',
    price:       89999,
    comparePrice:99999,
    isFeatured:  true,
    images:      IMG.fridge,
    description: 'AI Inverter side-by-side no-frost fridge with 442L capacity. Features 2 independent digitally controlled zones, 3 food preservation zones (fridge, crisper, freezer), toughened glass shelves, and door balconies. Comes with twist ice tray, cool pack and wine rack.',
    specifications: { capacity: '442L', dimensions: '910×590×1770mm', power: '150W', gas: 'R600a', voltage: 'AC 180–250V', freezerVolume: '151L', fridgeVolume: '291L' },
    features: ['AI Inverter Compressor', 'No Frost Technology', '2 Independent Cooling Zones', 'Crisper Zone for Fruits & Nuts', 'Toughened Glass Shelves', 'Wide Voltage Tolerance'],
    tags: ['fridge', 'no-frost', 'inverter', 'side-by-side', 'mika'],
    stock: 12,
  },
  {
    name:        'MIKA Water Dispenser Hot & Electric Cooling Cabinet White/Black MWD2304WB',
    slug:        'mika-water-dispenser-hot-electric-cabinet-mwd2304wb',
    sku:         'MWD2304WB',
    brand:       'Mika',
    category:    'KITCHEN' as const,
    subcategory: 'water-dispensers',
    price:       14999,
    comparePrice:17999,
    isFeatured:  false,
    images:      IMG.dispenser,
    description: 'Standing hot & electric cooling water dispenser with storage cabinet. Stainless steel hot water tank with child safety lock. Easy-to-use press taps and hot water power switch.',
    specifications: { power: '485W', heatingCapacity: '5L/H', coolingCapacity: '1L/H', hotTank: '0.6L', coldTank: '0.6L', dimensions: '270×290×858mm', color: 'White & Black' },
    features: ['Hot & Electric Cooling', 'Stainless Steel Hot Tank', 'Child Safety Lock', 'Storage Cabinet', 'Easy Press Taps'],
    tags: ['water dispenser', 'hot cold', 'cabinet', 'mika'],
    stock: 20,
  },
  {
    name:        'MIKA Water Dispenser 3-Tap Hot Normal & Electric Cooling Cabinet Black/Grey MWD2307BG',
    slug:        'mika-water-dispenser-3tap-hot-normal-electric-mwd2307bg',
    sku:         'MWD2307BG',
    brand:       'Mika',
    category:    'KITCHEN' as const,
    subcategory: 'water-dispensers',
    price:       17999,
    comparePrice:20999,
    isFeatured:  false,
    images:      IMG.dispenser,
    description: 'Standing 3-tap dispenser with hot, normal and electric cooling functions. Larger hot tank capacity of 0.8L with stainless steel construction. Includes storage cabinet.',
    specifications: { power: '565W', heatingCapacity: '5L/H', coolingCapacity: '1L/H', hotTank: '0.8L', coldTank: '0.6L', dimensions: '300×330×1010mm', color: 'Black & Grey' },
    features: ['3 Taps (Hot / Normal / Cold)', 'Stainless Steel Hot Tank', 'Child Safety Lock', 'Storage Cabinet', '0.8L Hot Tank Capacity'],
    tags: ['water dispenser', '3 tap', 'hot cold normal', 'mika'],
    stock: 15,
  },
  {
    name:        'MIKA Bottom Load Water Dispenser Hot Normal & Compressor Cold 3-Tap Black/Silver MWDB2804BS',
    slug:        'mika-bottom-load-dispenser-compressor-mwdb2804bs',
    sku:         'MWDB2804BS',
    brand:       'Mika',
    category:    'KITCHEN' as const,
    subcategory: 'water-dispensers',
    price:       22999,
    comparePrice:27999,
    isFeatured:  true,
    images:      IMG.dispenser,
    description: 'Premium bottom-load dispenser — no heavy lifting. Compressor cooling for faster, colder water. Concealed bottle for a sleek look. Stainless steel hot tank, child safety lock, and power protection fuse.',
    specifications: { power: '585W', heatingPower: '500W', coolingPower: '85W', heatingCapacity: '5L/h', coolingCapacity: '2L/h', dimensions: '310×350×1035mm', color: 'Black & Silver' },
    features: ['Bottom Load — No Heavy Lifting', 'Compressor Cooling (2L/h)', 'Concealed Bottle Cabinet', 'Stainless Steel Hot Tank', 'Child Safety Lock', 'Power Protection Fuse'],
    tags: ['water dispenser', 'bottom load', 'compressor', 'mika'],
    stock: 10,
  },
  {
    name:        'MIKA 8kg Front Load Inverter Washing Machine Dark Silver MWAF13408DSV',
    slug:        'mika-8kg-front-load-inverter-washer-mwaf13408dsv',
    sku:         'MWAF13408DSV',
    brand:       'Mika',
    category:    'KITCHEN' as const,
    subcategory: 'washing-machines',
    price:       62999,
    comparePrice:74999,
    isFeatured:  true,
    images:      IMG.washer,
    description: 'A+++ rated front-load inverter washing machine with brushless motor (10-year warranty). Features Spa Care steam washing, 14 programs, 59-min quick wash, night wash mode, and self-diagnosis. 1400 RPM spin speed.',
    specifications: { capacity: '8kg', spinSpeed: '1400 RPM', programs: '14', power: '1950W', voltage: 'AC 220–240V/50Hz', dimensions: '595×600×850mm', weight: '65kg (net)' },
    features: ['Brushless Inverter Motor (10yr warranty)', 'A+++ Energy Rating', 'Spa Care Steam Wash', '59 Min Quick Wash', 'Night Wash Mode', 'Delay Start up to 24Hrs', 'Self-Diagnose', 'Add Garment Mid-Cycle'],
    tags: ['washing machine', 'front load', 'inverter', '8kg', 'mika'],
    stock: 8,
  },
  {
    name:        'Ramtons 10kg Semi-Automatic Twin Tub Washer 6kg Spin RW/215',
    slug:        'ramtons-10kg-semi-auto-twin-tub-rw215',
    sku:         'RW/215',
    brand:       'Ramtons',
    category:    'KITCHEN' as const,
    subcategory: 'washing-machines',
    price:       18500,
    comparePrice:21000,
    isFeatured:  false,
    images:      IMG.washer,
    description: 'Practical twin-tub semi-automatic washer with 10kg wash and 6kg spin capacity. Air-dry technology spins without heat for up to 80% dryness, saving energy. Water-efficient design uses less water than fully automatic machines. Gravity drain with lint filter and rat-proof base.',
    specifications: { washCapacity: '10kg', spinCapacity: '6kg', dryingEfficiency: '80%' },
    features: ['10kg Wash + 6kg Spin', 'Air Dry Technology (no heat)', 'Water-Efficient Twin Tub', 'Manual Timer & Load Selector', 'Gravity Drain with Lint Filter', 'Rat-Proof Base'],
    tags: ['washing machine', 'semi-automatic', 'twin tub', 'ramtons'],
    stock: 18,
  },
  {
    name:        'Hisense 5-Burner 90cm Built-In Gas Hob Black Stainless Steel HGH951BS01',
    slug:        'hisense-5-burner-90cm-gas-hob-hgh951bs01',
    sku:         'HGH951BS01',
    brand:       'Hisense',
    category:    'KITCHEN' as const,
    subcategory: 'built-in',
    price:       34999,
    comparePrice:40999,
    isFeatured:  true,
    images:      IMG.hob,
    description: '90cm 5-burner built-in gas hob with cast iron pan supports. Auto electronic ignition and flame failure safety device for peace of mind. Black stainless steel finish.',
    specifications: { burners: '5', totalPower: '10.6kW', dimensions: 'W860×D510mm', cutOut: 'W830×D490mm', finish: 'Black Stainless Steel', warranty: '12 months' },
    features: ['5 Gas Burners', 'Cast Iron Pan Supports', 'Auto Electronic Ignition', 'Flame Failure Safety Device', 'Black Stainless Steel Finish'],
    tags: ['hob', 'built-in', 'gas', '90cm', 'hisense'],
    stock: 6,
  },
  {
    name:        'Hisense 4-Burner 60cm Built-In Gas Hob Black Glass HHU60GAGB',
    slug:        'hisense-4-burner-60cm-gas-hob-hhu60gagb',
    sku:         'HHU60GAGB',
    brand:       'Hisense',
    category:    'KITCHEN' as const,
    subcategory: 'built-in',
    price:       24999,
    comparePrice:29999,
    isFeatured:  false,
    images:      IMG.hob,
    description: '60cm 4-burner built-in gas hob with black glass finish. Auto electronic ignition and flame failure safety on all burners. Cast iron pan supports for stability.',
    specifications: { burners: '4', frontLeft: '3.6kW', rearLeft: '1.75kW', frontRight: '1.0kW', rearRight: '1.75kW', dimensions: 'W600×D520×H89mm', cutOut: 'W560×D490mm', warranty: '12 months' },
    features: ['4 Gas Burners', 'Black Glass Finish', 'Auto Electronic Ignition', 'Flame Failure Safety Device', 'Cast Iron Pan Supports'],
    tags: ['hob', 'built-in', 'gas', '60cm', 'hisense'],
    stock: 9,
  },
  {
    name:        'Hisense 60cm Vertical Extractor Hood Black Glass HAH602BG01',
    slug:        'hisense-60cm-vertical-hood-black-glass-hah602bg01',
    sku:         'HAH602BG01',
    brand:       'Hisense',
    category:    'KITCHEN' as const,
    subcategory: 'built-in',
    price:       19999,
    comparePrice:24999,
    isFeatured:  false,
    images:      IMG.hood,
    description: '60cm vertical extractor hood with touch controls and Wi-Fi function. LED lighting, aluminium filter, 4 fan speed levels and 470m³/h air extraction capacity.',
    specifications: { width: '60cm', extraction: '470 m³/h', fanSpeeds: '4', noise: '56dB max', lighting: 'LED 2×3W', filter: 'Aluminium', outlet: 'Ø120mm', dimensions: '600×380×335mm', warranty: '12 months' },
    features: ['Touch Control', 'Wi-Fi Function', '470m³/h Air Extraction', '4 Fan Speed Levels', 'LED Lighting', 'Aluminium Filter'],
    tags: ['hood', 'extractor', 'built-in', '60cm', 'hisense'],
    stock: 7,
  },
  {
    name:        'Hisense 90cm Vertical Extractor Hood Black Glass HAH902BG01',
    slug:        'hisense-90cm-vertical-hood-black-glass-hah902bg01',
    sku:         'HAH902BG01',
    brand:       'Hisense',
    category:    'KITCHEN' as const,
    subcategory: 'built-in',
    price:       25999,
    comparePrice:30999,
    isFeatured:  true,
    images:      IMG.hood,
    description: '90cm vertical extractor hood delivering 750m³/h air extraction. Touch controls, Wi-Fi connectivity, LED lighting and aluminium filters. 4 speed levels and maximum 56dB noise level.',
    specifications: { width: '90cm', extraction: '750 m³/h', fanSpeeds: '4', noise: '56dB max', lighting: 'LED 2×3W', filter: 'Aluminium', outlet: 'Ø120mm', dimensions: '900×380×335mm', warranty: '12 months' },
    features: ['Touch Control', 'Wi-Fi Function', '750m³/h Air Extraction', '4 Fan Speed Levels', 'LED Lighting', 'Aluminium Filters'],
    tags: ['hood', 'extractor', 'built-in', '90cm', 'hisense'],
    stock: 5,
  },

  // ── TECH ────────────────────────────────────────────────────────────────────
  {
    name:        'Samsung 55" 4K QLED Smart TV QE55Q60C',
    slug:        'samsung-55-4k-qled-smart-tv-qe55q60c',
    sku:         'QE55Q60C',
    brand:       'Samsung',
    category:    'AUDIO_TV' as const,
    subcategory: 'smart-tvs',
    price:       89999,
    comparePrice:109999,
    isFeatured:  true,
    images:      IMG.tv,
    description: '55-inch QLED 4K Smart TV with Quantum Dot technology for vivid colour. Features AirSlim design, Quantum HDR, Object Tracking Sound, and built-in Wi-Fi. Compatible with Google Assistant and Alexa.',
    specifications: { screenSize: '55"', resolution: '4K UHD (3840×2160)', technology: 'QLED', hdr: 'Quantum HDR', sound: 'Object Tracking Sound 20W', smartTV: 'Tizen OS' },
    features: ['Quantum Dot Technology', '4K UHD Resolution', 'Quantum HDR', 'Object Tracking Sound', 'AirSlim Design', 'Google Assistant Built-In'],
    tags: ['tv', '4k', 'qled', 'samsung', 'smart tv'],
    stock: 10,
  },
  {
    name:        'Samsung Galaxy A55 5G 8GB/256GB',
    slug:        'samsung-galaxy-a55-5g-256gb',
    sku:         'SM-A556B',
    brand:       'Samsung',
    category:    'SMARTPHONES' as const,
    subcategory: 'phones',
    price:       54999,
    comparePrice:62000,
    isFeatured:  true,
    images:      IMG.phone,
    description: 'Samsung Galaxy A55 5G with a 6.6" Super AMOLED display, 50MP triple camera system, and 5,000mAh battery. 8GB RAM and 256GB storage for seamless multitasking.',
    specifications: { display: '6.6" FHD+ Super AMOLED 120Hz', processor: 'Exynos 1480', ram: '8GB', storage: '256GB', camera: '50MP + 12MP + 5MP', battery: '5000mAh', os: 'Android 14', connectivity: '5G' },
    features: ['5G Connectivity', '50MP Triple Camera', '120Hz AMOLED Display', '5000mAh Battery', 'IP67 Water Resistance', 'Samsung Knox Security'],
    tags: ['phone', 'samsung', '5g', 'galaxy a55'],
    stock: 25,
  },
  {
    name:        'HP 15 Laptop Intel Core i5 8GB RAM 512GB SSD',
    slug:        'hp-15-laptop-i5-8gb-512gb-ssd',
    sku:         'HP15-FD0098NE',
    brand:       'HP',
    category:    'LAPTOPS' as const,
    subcategory: 'laptops',
    price:       74999,
    comparePrice:84999,
    isFeatured:  true,
    images:      IMG.laptop,
    description: 'Everyday HP 15 laptop with Intel Core i5 processor, 8GB DDR4 RAM, 512GB SSD and a 15.6" FHD display. Comes with Windows 11 Home and offers fast boot times and smooth multitasking.',
    specifications: { display: '15.6" FHD (1920×1080)', processor: 'Intel Core i5-1235U', ram: '8GB DDR4', storage: '512GB SSD', os: 'Windows 11 Home', graphics: 'Intel Iris Xe', battery: 'Up to 8 hrs', weight: '1.75kg' },
    features: ['Intel Core i5 12th Gen', '512GB Fast SSD', 'Windows 11 Home', 'HP Fast Charge', 'Wi-Fi 6', 'Backlit Keyboard'],
    tags: ['laptop', 'hp', 'intel i5', 'windows 11', '512gb'],
    stock: 14,
  },
]

async function main() {
  console.log('Seeding Smartech Kenya database...')

  // Create a system admin/seller user
  const hashedPw = await bcrypt.hash('SmartechAdmin2024!', 12)

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
  })

  console.log(`Admin user: ${admin.email}`)

  let created = 0
  let skipped = 0

  for (const p of PRODUCTS) {
    try {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          price:          p.price,
          comparePrice:   p.comparePrice,
          stock:          p.stock,
          isFeatured:     p.isFeatured,
          isActive:       true,
        },
        create: {
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
      })
      console.log(`  + ${p.name}`)
      created++
    } catch (e: any) {
      console.log(`  - SKIP ${p.sku}: ${e.message}`)
      skipped++
    }
  }

  console.log(`\nDone: ${created} products seeded, ${skipped} skipped.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
