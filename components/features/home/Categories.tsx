import Link from 'next/link';

export function Categories() {
  const categories = [
    {
      name: 'Technology',
      slug: 'TECH',
      description: 'Latest smartphones, laptops, and gadgets',
      icon: '💻',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Kitchen',
      slug: 'KITCHEN',
      description: 'Modern appliances for your kitchen',
      icon: '🍳',
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-white hover:scale-[1.02] transition-transform"
          style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
          
          <div className="relative">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h3 className="text-3xl font-display font-bold mb-2">{category.name}</h3>
            <p className="text-white/90 mb-4">{category.description}</p>
            <div className="inline-flex items-center gap-2 font-medium group-hover:gap-4 transition-all">
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
