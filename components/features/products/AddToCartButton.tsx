'use client';

import { useState }   from 'react';
import { useDispatch } from 'react-redux';
import { addToCart }   from '@/store/slices/cartSlice';
import toast           from 'react-hot-toast';

interface Props {
  productId: string;
  name:      string;
  price:     number;
  image:     string;
  stock:     number;
}

export function AddToCartButton({ productId, name, price, image, stock }: Props) {
  const dispatch = useDispatch();
  const [added,   setAdded]   = useState(false);

  if (stock === 0) {
    return (
      <button disabled
        className="flex-1 px-7 py-4 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-900 opacity-40 cursor-not-allowed">
        Out of Stock
      </button>
    );
  }

  const handleAdd = () => {
    dispatch(addToCart({ productId, name, price, image, quantity: 1, stock }));
    setAdded(true);
    toast.success('Added to cart 🛒', {
      style: { background: '#0A0A14', color: '#F8F9FB', borderRadius: '14px', fontSize: '13px' },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className="flex-1 px-7 py-4 rounded-full text-sm font-semibold border transition-all duration-200"
      style={{
        borderColor:       added ? '#166534' : '#E5E7EB',
        background:        added ? 'rgba(22,101,52,0.08)' : 'white',
        color:             added ? '#166534' : '#0A0A14',
      }}>
      {added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
