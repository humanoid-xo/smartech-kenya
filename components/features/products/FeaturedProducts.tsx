import { ProductCard } from './ProductCard';

async function getFeaturedProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=8`, {
    cache: 'no-store',
  });
  
  const data = await res.json();
  return data.data?.products || [];
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
