import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSortOption, selectSortOption } from '../store/productsSlice';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
  { label: 'Rating: High to Low', value: 'rating_high_low' },
  
];

const FUNCTIONAL_OPTIONS = ['price_low_high', 'price_high_low', 'rating_high_low'];

const SortModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const currentSort = useSelector(selectSortOption);

  const handleSelect = (value) => {
    if (FUNCTIONAL_OPTIONS.includes(value)) {
      dispatch(setSortOption(value === currentSort ? null : value));
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Sort By</Text>

        {SORT_OPTIONS.map((option) => {
          const isActive = currentSort === option.value;
          const isFunctional = FUNCTIONAL_OPTIONS.includes(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  {isActive && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                  {option.label}
                </Text>
              </View>
              {!isFunctional && (
                <Text style={styles.staticLabel}>UI Only</Text>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeBtnText}>Apply</Text>
        </TouchableOpacity>
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
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.md,
    ...SHADOWS.card,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.base,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.base,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionActive: {
    // highlight handled via text/radio
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  optionText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textPrimary,
  },
  optionTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  staticLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    backgroundColor: COLORS.tagBg,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  closeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
    marginTop: SPACING.base,
  },
  closeBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
  },
});

export default SortModal;
