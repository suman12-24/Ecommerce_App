import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToBag, selectBagItems } from '../store/bagSlice';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

// Render filled/empty stars with numeric rate shown beside them
const StarRating = ({ rating, count, isGrid }) => {
  const rate = rating || 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text
        key={i}
        style={[
          styles.star,
          isGrid && styles.starGrid,
          { color: i <= Math.round(rate) ? COLORS.ratingYellow : COLORS.border },
        ]}
      >
        ★
      </Text>
    );
  }
  return (
    <View style={styles.ratingRow}>
      <View style={styles.starsRow}>{stars}</View>
      {/* Show numeric rate + count */}
      <Text style={styles.ratingValue}>{rate.toFixed(1)}</Text>
      {!isGrid && count != null && (
        <Text style={styles.ratingCount}>({count})</Text>
      )}
    </View>
  );
};

const ProductCard = ({ product, isGrid = false }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector(selectBagItems);
  const inBag = bagItems.some(item => item.id === product.id);
  const [pressed, setPressed] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToBag = () => {
    dispatch(addToBag(product));
    setPressed(true);
    setTimeout(() => setPressed(false), 1500);
  };

  const categoryLabel = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : '';

  // Truncate long titles cleanly for grid display
  const title = product.title || '';
  const gridTitle = title.length > 40 ? title.slice(0, 38).trimEnd() + '…' : title;

  return (
    <View style={[styles.card, isGrid && styles.cardGrid]}>
      {/* Image */}
      <View style={[styles.imageContainer, isGrid && styles.imageContainerGrid]}>
        {imageLoading && (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            size={isGrid ? 'small' : 'large'}
            color={COLORS.primary}
          />
        )}
        <Image
          source={{ uri: product.image }}
          style={[styles.image, imageLoading && styles.imageHidden]}
          resizeMode="contain"
          onLoadEnd={() => setImageLoading(false)}
        />
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {categoryLabel}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={[styles.content, isGrid && styles.contentGrid]}>
        {/* Title: show 2 lines in both modes but use pre-truncated text in grid */}
        <Text
          style={[styles.title, isGrid && styles.titleGrid]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {isGrid ? gridTitle : title}
        </Text>

        {isGrid && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}

        <StarRating
          rating={product.rating?.rate}
          count={product.rating?.count}
          isGrid={isGrid}
        />

        <View style={styles.footer}>
          <Text style={[styles.price, isGrid && styles.priceGrid]}>
            ${product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              isGrid && styles.addButtonGrid,
              (inBag || pressed) && styles.addButtonActive,
            ]}
            onPress={handleAddToBag}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.addButtonText,
                isGrid && styles.addButtonTextGrid,
                (inBag || pressed) && styles.addButtonTextActive,
              ]}
            >
              {inBag ? '✓ Added' : '+ Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.base,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  cardGrid: {
    marginHorizontal: 0,
    borderRadius: RADIUS.md,
  },

  imageContainer: {
    height: 200,
    backgroundColor: '#FAFAFA',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.base,
  },
  imageContainerGrid: {
    height: 130,
    padding: SPACING.sm,
  },

  image: {
    width: '100%',
    height: '100%',
  },
  imageHidden: {
    opacity: 0,
  },

  categoryTag: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.tagBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    maxWidth: 110,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  content: {
    padding: SPACING.base,
  },
  contentGrid: {
    padding: SPACING.sm,
  },

  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  titleGrid: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 17,
    marginBottom: 4,
    minHeight: 34,
  },

  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },

  // Rating row — stars + numeric rate + optional count
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    flexWrap: 'nowrap',
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 3,
  },
  star: {
    fontSize: 12,
    marginRight: 1,
  },
  starGrid: {
    fontSize: 10,
  },
  ratingValue: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginRight: 2,
  },
  ratingCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  price: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  priceGrid: {
    fontSize: FONTS.sizes.md,
  },

  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  addButtonGrid: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  addButtonActive: {
    backgroundColor: COLORS.success,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  addButtonTextGrid: {
    fontSize: FONTS.sizes.xs,
  },
  addButtonTextActive: {
    color: COLORS.white,
  },
});

export default ProductCard;
