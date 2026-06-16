import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectFilteredAndSortedProducts,
  selectProductsLoading,
  selectProductsError,
  selectSortOption,
  selectActiveCategory,
  selectActivePriceRange,
  selectActiveRating,
  selectActiveFilterCount,
  clearFilters,
  setSortOption,
  setActiveCategory,
  setActivePriceRange,
  setActiveRating,
} from '../store/productsSlice';
import { selectBagCount } from '../store/bagSlice';
import ProductCard from '../components/ProductCard';
import SortModal from '../components/SortModal';
import FilterModal from '../components/FilterModal';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const ProductsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectFilteredAndSortedProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const bagCount = useSelector(selectBagCount);
  const sortOption = useSelector(selectSortOption);
  const activeCategory = useSelector(selectActiveCategory);
  const activePriceRange = useSelector(selectActivePriceRange);
  const activeRating = useSelector(selectActiveRating);
  const activeFilterCount = useSelector(selectActiveFilterCount);

  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const hasActiveFilters = activeFilterCount > 0;
  const hasActiveSort = !!sortOption;

  const SORT_LABELS = {
    price_low_high: 'Price ↑',
    price_high_low: 'Price ↓',
    rating_high_low: 'Rating ↓',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Discover</Text>
          <Text style={styles.headerTitle}>Products</Text>
        </View>
        <TouchableOpacity
          style={styles.bagBtn}
          onPress={() => navigation.navigate('Bag')}
          activeOpacity={0.8}
        >
          <Text style={styles.bagIcon}>🛍</Text>
          {bagCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{bagCount > 99 ? '99+' : bagCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active filter pills */}
      {(hasActiveFilters || hasActiveSort) && (
        <View style={styles.activePills}>
          {hasActiveSort && (
            <View style={styles.activePill}>
              <Text style={styles.activePillText} numberOfLines={1}>
                {SORT_LABELS[sortOption]}
              </Text>
              <TouchableOpacity onPress={() => dispatch(setSortOption(null))}>
                <Text style={styles.pillRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {activeCategory && (
            <View style={[styles.activePill, styles.filterPill]}>
              <Text style={styles.activePillText} numberOfLines={1}>
                {activeCategory}
              </Text>
              <TouchableOpacity onPress={() => dispatch(setActiveCategory(null))}>
                <Text style={styles.pillRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {activePriceRange && (
            <View style={[styles.activePill, styles.filterPill]}>
              <Text style={styles.activePillText} numberOfLines={1}>
                {activePriceRange}
              </Text>
              <TouchableOpacity onPress={() => dispatch(setActivePriceRange(null))}>
                <Text style={styles.pillRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {activeRating && (
            <View style={[styles.activePill, styles.filterPill]}>
              <Text style={styles.activePillText} numberOfLines={1}>
                {activeRating}
              </Text>
              <TouchableOpacity onPress={() => dispatch(setActiveRating(null))}>
                <Text style={styles.pillRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Sort / Filter Controls */}
      <View style={styles.controlsRow}>
        <Text style={styles.resultCount} numberOfLines={1}>
          {loading ? 'Loading…' : `${products.length} items`}
        </Text>
        <View style={styles.controlBtns}>
          <TouchableOpacity
            style={[styles.controlBtn, hasActiveSort && styles.controlBtnActive]}
            onPress={() => setSortVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.controlBtnText, hasActiveSort && styles.controlBtnTextActive]}>
              ↕ Sort
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, hasActiveFilters && styles.controlBtnActive]}
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.controlBtnText, hasActiveFilters && styles.controlBtnTextActive]}>
              {hasActiveFilters ? `⚙ Filter (${activeFilterCount})` : '⚙ Filter'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Failed to load products</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchProducts())}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard product={item} isGrid={true} />
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No products match your filters</Text>
              <TouchableOpacity onPress={() => dispatch(clearFilters())}>
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <SortModal visible={sortVisible} onClose={() => setSortVisible(false)} />
      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    ...SHADOWS.header,
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  bagBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bagIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  activePills: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    flexWrap: 'wrap',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
    maxWidth: 160,
  },
  filterPill: {
    backgroundColor: COLORS.accent,
  },
  activePillText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  pillRemove: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
    marginRight: SPACING.sm,
  },
  controlBtns: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexShrink: 0,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  controlBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  controlBtnText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  controlBtnTextActive: {
    color: COLORS.white,
  },
  list: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.base,
  },
  columnWrapper: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  gridItem: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
    textAlign: 'center',
  },
  clearFiltersText: {
    color: COLORS.accent,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
});

export default ProductsScreen;