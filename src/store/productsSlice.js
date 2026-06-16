import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  return data;
});

export const PRICE_RANGE_MAP = {
  'Under $20':  { min: 0,   max: 20 },
  '$20 - $50':  { min: 20,  max: 50 },
  '$50 - $100': { min: 50,  max: 100 },
  'Over $100':  { min: 100, max: Infinity },
};

export const RATING_MIN_MAP = {
  '4★ & above': 4,
  '3★ & above': 3,
  '2★ & above': 2,
};

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    sortOption: null,
    activeCategory: null,
    activePriceRange: null,
    activeRating: null,
  },
  reducers: {
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setActivePriceRange: (state, action) => {
      state.activePriceRange = action.payload;
    },
    setActiveRating: (state, action) => {
      state.activeRating = action.payload;
    },
    clearFilters: (state) => {
      state.activeCategory = null;
      state.activePriceRange = null;
      state.activeRating = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSortOption,
  setActiveCategory,
  setActivePriceRange,
  setActiveRating,
  clearFilters,
} = productsSlice.actions;

// Simple selectors
export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSortOption = (state) => state.products.sortOption;
export const selectActiveCategory = (state) => state.products.activeCategory;
export const selectActivePriceRange = (state) => state.products.activePriceRange;
export const selectActiveRating = (state) => state.products.activeRating;

// Memoized selectors
export const selectCategories = createSelector(
  (state) => state.products.items,
  (items) => [...new Set(items.map(p => p.category))]
);

export const selectActiveFilterCount = createSelector(
  (state) => state.products.activeCategory,
  (state) => state.products.activePriceRange,
  (state) => state.products.activeRating,
  (activeCategory, activePriceRange, activeRating) => {
    let count = 0;
    if (activeCategory) count++;
    if (activePriceRange) count++;
    if (activeRating) count++;
    return count;
  }
);

export const selectFilteredAndSortedProducts = createSelector(
  (state) => state.products.items,
  (state) => state.products.activeCategory,
  (state) => state.products.activePriceRange,
  (state) => state.products.activeRating,
  (state) => state.products.sortOption,
  (items, activeCategory, activePriceRange, activeRating, sortOption) => {
    let products = [...items];

    if (activeCategory) {
      products = products.filter(p => p.category === activeCategory);
    }

    if (activePriceRange) {
      const range = PRICE_RANGE_MAP[activePriceRange];
      if (range) {
        products = products.filter(p => p.price >= range.min && p.price < range.max);
      }
    }

    if (activeRating) {
      const minRating = RATING_MIN_MAP[activeRating];
      if (minRating !== undefined) {
        products = products.filter(p => (p.rating?.rate || 0) >= minRating);
      }
    }

    switch (sortOption) {
      case 'price_low_high':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating_high_low':
        products.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      default:
        break;
    }

    return products;
  }
);

export default productsSlice.reducer;