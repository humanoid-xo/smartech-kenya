# Smartech Kenya - E-Commerce Marketplace

<div align="center">

![Smartech Kenya Logo](https://via.placeholder.com/150x150/006400/FFFFFF?text=SK)

**Kenya's Premier Marketplace for Tech & Kitchen Appliances**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.8.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

[Features](#features) • [Installation](#installation) • [Deployment](#deployment) • [Documentation](#documentation)

</div>

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

Smartech Kenya is a production-ready e-commerce marketplace built specifically for the Kenyan market. It combines luxury brand-inspired UI/UX with local payment solutions (M-Pesa) and features tailored for Kenyan consumers and businesses.

### Why Smartech Kenya?

- **🇰🇪 Kenya-First**: M-Pesa integration, KES currency, local market focus
- **💎 Premium Experience**: Luxury brand-inspired design (H&M, Gucci, RH)
- **🏪 Multi-Vendor**: Support for multiple sellers on one platform
- **📱 Mobile-Optimized**: Responsive design for Kenya's mobile-first market
- **⚡ Performance**: Fast loading, optimized for varying internet speeds
- **🔒 Secure**: Industry-standard security practices

---

## ✨ Features

### For Buyers
- ✅ Browse tech and kitchen appliances
- ✅ Advanced product filtering and search
- ✅ Shopping cart with persistent storage
- ✅ Wishlist functionality
- ✅ M-Pesa payment integration
- ✅ Order tracking
- ✅ Product reviews and ratings
- ✅ Email and SMS notifications

### For Sellers
- ✅ Seller dashboard
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Sales tracking
- ✅ Inventory management

### Admin Features (To be extended)
- ✅ User management
- ✅ Order oversight
- ⏳ Analytics dashboard
- ⏳ Revenue reporting

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Custom components with Tailwind
- **Forms**: React Hook Form + Zod validation
- **Notifications**: React Hot Toast

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary
- **Payments**: M-Pesa (Daraja API)
- **Email**: Nodemailer
- **SMS**: Twilio

### DevOps
- **Version Control**: Git
- **Hosting**: Vercel (recommended)
- **Database Hosting**: MongoDB Atlas
- **CI/CD**: GitHub Actions (optional)
- **Monitoring**: Sentry (optional)
- **Analytics**: Google Analytics (optional)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- M-Pesa Daraja API credentials
- Cloudinary account (free tier)
- Twilio account (free trial)
- Optional: Gmail for email notifications

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smartech-kenya.git
cd smartech-kenya
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your credentials:
- MongoDB connection string
- NextAuth secret (generate with `openssl rand -base64 32`)
- M-Pesa API credentials
- Cloudinary credentials
- Twilio credentials
- Email SMTP details

4. **Initialize the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Seed the database (optional)**
```bash
npm run seed
```

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
smartech-kenya/
├── app/                        # Next.js app directory
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── products/           # Product CRUD
│   │   ├── orders/             # Order management
│   │   ├── mpesa/              # M-Pesa integration
│   │   └── register/           # User registration
│   ├── (auth)/                 # Auth pages group
│   │   ├── login/
│   │   └── register/
│   ├── products/               # Product pages
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Checkout flow
│   ├── seller/                 # Seller dashboard
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                 # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   └── ...
├── lib/                        # Utility functions
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # Auth config
│   ├── mpesa.ts                # M-Pesa utilities
│   └── notifications.ts        # Email/SMS
├── store/                      # Redux store
│   ├── index.ts
│   └── slices/
│       ├── cartSlice.ts
│       └── wishlistSlice.ts
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── .env.example                # Environment template
├── next.config.js              # Next.js config
├── tailwind.config.js          # Tailwind config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 📡 API Documentation

### Authentication

#### POST `/api/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0712345678",
  "isSeller": false
}
```

#### POST `/api/auth/[...nextauth]`
Login (handled by NextAuth)

### Products

#### GET `/api/products`
Get products with optional filtering
```
Query params:
- category: "tech" | "kitchen"
- brand: string
- minPrice: number
- maxPrice: number
- search: string
- page: number
- limit: number
```

#### GET `/api/products/[id]`
Get single product

#### POST `/api/products`
Create product (seller only)

#### PUT `/api/products/[id]`
Update product (seller only)

#### DELETE `/api/products/[id]`
Delete product (seller only)

### Orders

#### POST `/api/orders`
Create order

#### GET `/api/orders`
Get user orders

### M-Pesa

#### POST `/api/mpesa/initiate`
Initiate STK push
```json
{
  "phone": "254712345678",
  "amount": 5000,
  "orderId": "order_id_here"
}
```

#### POST `/api/mpesa/callback`
M-Pesa callback (automated)

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your repository
- Configure environment variables
- Deploy

3. **Post-deployment**
- Update `MPESA_CALLBACK_URL` to your production URL
- Switch `MPESA_ENV` to "production" when ready
- Set up custom domain

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

3. **Use a process manager**
```bash
npm install -g pm2
pm2 start npm --name "smartech-kenya" -- start
```

---

## 🧪 Testing

### Run tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Browse products
- [ ] Search and filter
- [ ] Add to cart
- [ ] Checkout process
- [ ] M-Pesa payment (sandbox)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Seller dashboard
- [ ] Product management
- [ ] Order tracking

---

## 📊 Performance

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### Optimizations Implemented
- Next.js Image optimization
- Code splitting
- Lazy loading
- Bundle size optimization
- Database indexing
- API response caching
- PWA support

---

## 🔒 Security

### Implemented Security Measures
- Password hashing (bcrypt)
- JWT authentication
- CSRF protection
- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection (React)
- Secure headers
- Environment variable protection

### Recommended Additional Measures
- Rate limiting
- DDoS protection (Cloudflare)
- Two-factor authentication
- Security audit logs
- Regular dependency updates
- Penetration testing

---

## 🐛 Troubleshooting

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed troubleshooting.

Common issues:
- **Database connection**: Check DATABASE_URL and MongoDB Atlas IP whitelist
- **M-Pesa callback**: Ensure callback URL is publicly accessible
- **Build errors**: Clear `.next` folder and rebuild
- **Environment variables**: Verify all required variables are set

---

## 📝 Roadmap

### Phase 1 (Current)
- [x] Core marketplace functionality
- [x] M-Pesa integration
- [x] Multi-seller support
- [x] Basic seller dashboard

### Phase 2 (Next)
- [ ] Advanced analytics dashboard
- [ ] Product recommendations
- [ ] Live chat support
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] AI-powered search
- [ ] Augmented Reality product preview
- [ ] Social commerce integration
- [ ] Subscription service

---

## 🤝 Contributing

This is a proprietary project. For contributions:
1. Contact the project owner
2. Sign the CLA
3. Follow the contribution guidelines

---

## 📄 License

Proprietary License - © 2025 Smartech Kenya

All rights reserved. Unauthorized copying, distribution, or modification of this software is strictly prohibited.

---

## 📞 Support

- **Email**: support@smartechkenya.com
- **Phone**: +254 XXX XXX XXX
- **Website**: https://smartechkenya.com

---

## 🙏 Acknowledgments

- UI/UX inspiration: H&M, Gucci, Ralph Lauren, Roche Bobois, RH
- Payment infrastructure: Safaricom M-Pesa
- Community: Next.js, React, and Prisma communities

---

<div align="center">

**Built with ❤️ in Kenya, for Kenya**

[⬆ Back to Top](#smartech-kenya---e-commerce-marketplace)

</div>
