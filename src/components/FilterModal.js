import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveCategory,
  setActivePriceRange,
  setActiveRating,
  clearFilters,
  selectActiveCategory,
  selectActivePriceRange,
  selectActiveRating,
  selectCategories,
} from '../store/productsSlice';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

const PRICE_RANGES = ['Under $20', '$20 - $50', '$50 - $100', 'Over $100'];
const RATINGS = ['4★ & above', '3★ & above', '2★ & above'];

const FilterModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const activeCategory = useSelector(selectActiveCategory);
  const activePriceRange = useSelector(selectActivePriceRange);
  const activeRating = useSelector(selectActiveRating);
  const categories = useSelector(selectCategories);

  const [localCategory, setLocalCategory] = useState(activeCategory);
  const [localPriceRange, setLocalPriceRange] = useState(activePriceRange);
  const [localRating, setLocalRating] = useState(activeRating);

  // Sync local state when modal opens
  React.useEffect(() => {
    if (visible) {
      setLocalCategory(activeCategory);
      setLocalPriceRange(activePriceRange);
      setLocalRating(activeRating);
    }
  }, [visible, activeCategory, activePriceRange, activeRating]);

  const handleApply = () => {
    dispatch(setActiveCategory(localCategory));
    dispatch(setActivePriceRange(localPriceRange));
    dispatch(setActiveRating(localRating));
    onClose();
  };

  const handleClear = () => {
    setLocalCategory(null);
    setLocalPriceRange(null);
    setLocalRating(null);
    dispatch(clearFilters());
    onClose();
  };

  const formatCategory = (cat) =>
    cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat;

  const toggle = (current, value, setter) =>
    setter(current === value ? null : value);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, localCategory === cat && styles.chipActive]}
                  onPress={() => toggle(localCategory, cat, setLocalCategory)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, localCategory === cat && styles.chipTextActive]}>
                    {formatCategory(cat)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.chipRow}>
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[styles.chip, localPriceRange === range && styles.chipActive]}
                  onPress={() => toggle(localPriceRange, range, setLocalPriceRange)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, localPriceRange === range && styles.chipTextActive]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Rating</Text>
            <View style={styles.chipRow}>
              {RATINGS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, localRating === r && styles.chipActive]}
                  onPress={() => toggle(localRating, r, setLocalRating)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, localRating === r && styles.chipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.8}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.8}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  sheet: {
    backgroundColor: COLORS.bottomSheet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.md,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clearText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.accent,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.xs,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.base,
  },
  clearBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
  },
  clearBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
  },
});

export default FilterModal;
