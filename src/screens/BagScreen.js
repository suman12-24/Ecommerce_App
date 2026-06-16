import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBagItems,
  selectBagCount,
  selectBagTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromBag,
  clearBag,
} from '../store/bagSlice';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const BagItem = ({ item, onIncrease, onDecrease, onRemove }) => (
  <View style={styles.itemCard}>
    {/* Remove icon */}
    <TouchableOpacity
      style={styles.removeIconBtn}
      onPress={() => onRemove(item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.removeIconText}>✕</Text>
    </TouchableOpacity>

    <View style={styles.itemImageBox}>
      <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
    </View>
    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      <Text style={styles.itemUnitPrice}>${item.price.toFixed(2)} each</Text>

      <View style={styles.qtyRow}>
        <TouchableOpacity
          style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDestructive]}
          onPress={() => item.quantity <= 1 ? onRemove(item.id) : onDecrease(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.qtyBtnText, item.quantity <= 1 && styles.qtyBtnTextDestructive]}>
            {item.quantity <= 1 ? '🗑' : '−'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.qtyValue}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onIncrease(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const EmptyBag = ({ onShop }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyEmoji}>🛍️</Text>
    <Text style={styles.emptyTitle}>Your bag is empty</Text>
    <Text style={styles.emptySubtitle}>
      Looks like you haven't added anything yet. Start exploring!
    </Text>
    <TouchableOpacity style={styles.shopBtn} onPress={onShop} activeOpacity={0.8}>
      <Text style={styles.shopBtnText}>Start Shopping</Text>
    </TouchableOpacity>
  </View>
);

const BagScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectBagItems);
  const bagCount = useSelector(selectBagCount);
  const bagTotal = useSelector(selectBagTotal);

  const handleClearBag = () => {
    Alert.alert(
      'Clear Bag',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearBag()) },
      ]
    );
  };

  const DELIVERY_FEE = bagTotal > 50 ? 0 : 4.99;
  const grandTotal = bagTotal + DELIVERY_FEE;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>My Bag</Text>
          {bagCount > 0 && (
            <Text style={styles.headerSub}>{bagCount} item{bagCount !== 1 ? 's' : ''}</Text>
          )}
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearBag} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyBag onShop={() => navigation.navigate('Products')} />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <BagItem
                item={item}
                onIncrease={(id) => dispatch(increaseQuantity(id))}
                onDecrease={(id) => dispatch(decreaseQuantity(id))}
                onRemove={(id) => dispatch(removeFromBag(id))}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({bagCount} items)</Text>
              <Text style={styles.summaryValue}>${bagTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, DELIVERY_FEE === 0 && styles.freeDelivery]}>
                {DELIVERY_FEE === 0 ? 'FREE' : `$${DELIVERY_FEE.toFixed(2)}`}
              </Text>
            </View>
            {DELIVERY_FEE > 0 && (
              <Text style={styles.freeDeliveryHint}>
                Add ${(50 - bagTotal).toFixed(2)} more for free delivery
              </Text>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Text style={styles.checkoutArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    ...SHADOWS.header,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',

  },
  backIcon: {
    fontSize: 26,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  clearBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  clearBtnText: {
    color: COLORS.accent,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  list: {
    padding: SPACING.base,
    paddingBottom: SPACING.sm,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    position: 'relative',
    ...SHADOWS.card,
  },
  removeIconBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFE5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    zIndex: 10,
    elevation: 6,   // must exceed card's elevation:3 on Android
  },
  removeIconText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
    lineHeight: 13,
  },
  itemImageBox: {
    width: 90,
    height: 90,
    backgroundColor: '#FAFAFA',
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: SPACING.xs,
    paddingRight: SPACING.xl,
  },
  itemPrice: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemUnitPrice: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.tagBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnDestructive: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFCDD2',
  },
  qtyBtnText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
    lineHeight: 20,
  },
  qtyBtnTextDestructive: {
    fontSize: 12,
  },
  qtyValue: {
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.header,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  freeDelivery: {
    color: COLORS.success,
    fontWeight: '700',
  },
  freeDeliveryHint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warning,
    marginBottom: SPACING.sm,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  checkoutArrow: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxl,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  shopBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default BagScreen;
