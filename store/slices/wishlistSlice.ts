import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  productIds: string[];
}

const loadWishlistFromLocalStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const savedWishlist = localStorage.getItem('smartech-wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch {
    return [];
  }
};

const saveWishlistToLocalStorage = (productIds: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smartech-wishlist', JSON.stringify(productIds));
  }
};

const initialState: WishlistState = {
  productIds: loadWishlistFromLocalStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
        saveWishlistToLocalStorage(state.productIds);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
      saveWishlistToLocalStorage(state.productIds);
    },
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const index = state.productIds.indexOf(action.payload);
      if (index > -1) {
        state.productIds.splice(index, 1);
      } else {
        state.productIds.push(action.payload);
      }
      saveWishlistToLocalStorage(state.productIds);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
