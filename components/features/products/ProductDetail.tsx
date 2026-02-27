"use client";

export function ProductDetail({ product }: { product: any }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-4">Product details will be displayed here...</p>
    </div>
  );
}
