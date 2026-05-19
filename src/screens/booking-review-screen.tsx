import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { BookingLayout } from '../components/booking-layout';
import { Theme } from '../theme/theme';

export function BookingReviewScreen({ navigation, route }: any) {
  // Grab passing initial remarks if any existed
  const [remarks, setRemarks] = useState(route?.params?.remarks || '');
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic state to simulate cart data matching the web visual screenshot
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Editorial Precision Cut', price: 120.00, details: 'with Elena Rostova' },
    { id: '2', name: 'Balayage & Soft Ivory Toning', price: 280.00, details: 'with Marcus Vance' },
  ]);

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalDue = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddAnotherService = () => {
    // Cycles back to Step 1 cleanly while retaining multi-cart memory states
    navigation.navigate('SelectService');
  };

  const handleProceedToDetails = () => {
    navigation.navigate('CustomerDetails', { remarks });
  };

  return (
    <BookingLayout
      step={4}
      stepTitle="Review & Cart"
      onBackPress={() => navigation.goBack()}
      onForwardPress={cartItems.length > 0 ? handleProceedToDetails : undefined}
      forwardLabel="Authorize via Stripe"
      isForwardDisabled={cartItems.length === 0}
    >
      <ScrollView style={styles.scrollCanvas} showsVerticalScrollIndicator={false}>
        
        {/* 1. SELECTION TRAY / ITEMS ADDED SECTION */}
        <Text style={styles.sectionLabel}>Selected Treatments ({cartItems.length})</Text>
        <View style={styles.contentGroup}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItemRow}>
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubText}>{item.details}</Text>
              </View>
              <View style={styles.itemActionBlock}>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(item.id)} activeOpacity={0.7}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* "+ Add Another Service" link button that loops back to Step 1 */}
          <TouchableOpacity 
            style={styles.addServiceButton} 
            onPress={handleAddAnotherService}
            
            activeOpacity={0.8}
          >
            <Text style={styles.addServiceButtonText}>+ Add Another Service</Text>
          </TouchableOpacity>
        </View>

        {/* 2. REPLICA OF THE WEB BOOKING SUMMARY / CART PANEL */}
        <Text style={styles.sectionLabel}>Cart Summary</Text>
        <View style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>Booking Summary</Text>
          
          {cartItems.map((item) => (
            <View key={`summary-${item.id}`} style={styles.receiptRow}>
              <Text style={styles.receiptItemText} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.receiptItemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalValue}>${totalDue.toFixed(2)}</Text>
          </View>
        </View>

        {/* 3. ADDITIONAL REMARKS INPUT CONTROLS */}
        <Text style={styles.sectionLabel}>Additional Remarks</Text>
        <View style={styles.remarksWrapper}>
          <TextInput
            style={[
              styles.remarksInputField, 
              isFocused && { borderColor: Theme.colors.luxuryBlack }
            ]}
            placeholder="Add any specific guidelines, preferences, or instructions here..."
            placeholderTextColor={Theme.colors.border}
            value={remarks}
            onChangeText={setRemarks}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        <View style={styles.bottomBuffer} />
      </ScrollView>
    </BookingLayout>
  );
}

const styles = StyleSheet.create({
  scrollCanvas: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory
  },
  sectionLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.m,
    marginTop: Theme.spacing.m,
    marginBottom: Theme.spacing.xs
  },
  contentGroup: {
    paddingHorizontal: Theme.spacing.m
  },
  cartItemRow: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs
  },
  itemMeta: {
    flex: 1,
    paddingRight: Theme.spacing.s
  },
  itemName: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  itemSubText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2
  },
  itemActionBlock: {
    alignItems: 'flex-end'
  },
  itemPrice: {
    fontFamily: Theme.fonts.bold,
    fontSize: 15,
    color: Theme.colors.textPrimary
  },
  removeText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 11,
    color: '#BA1A1A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4
  },
  addServiceButton: {
    borderWidth: 1,
    borderColor: Theme.colors.luxuryBlack,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.xs,
    borderRadius: 0
  },
  addServiceButtonText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 12,
    color: Theme.colors.luxuryBlack,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  receiptCard: { 
    backgroundColor: Theme.colors.white, 
    marginHorizontal: Theme.spacing.m, 
    padding: Theme.spacing.m, 
    borderWidth: 1, 
    borderColor: Theme.colors.border,
    borderRadius: 0
  },
  receiptTitle: { 
    fontFamily: Theme.fonts.bold,
    fontSize: 13, 
    color: Theme.colors.textPrimary, 
    marginBottom: Theme.spacing.s, 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  receiptRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8 
  },
  receiptItemText: { 
    fontFamily: Theme.fonts.regular,
    fontSize: 13, 
    color: Theme.colors.textSecondary,
    flex: 1,
    paddingRight: Theme.spacing.s
  },
  receiptItemPrice: { 
    fontFamily: Theme.fonts.medium,
    fontSize: 13, 
    color: Theme.colors.textPrimary 
  },
  divider: { 
    height: 1, 
    backgroundColor: Theme.colors.warmStone, 
    marginVertical: Theme.spacing.s 
  },
  totalLabel: { 
    fontFamily: Theme.fonts.bold,
    fontSize: 14, 
    textTransform: 'uppercase',
    color: Theme.colors.textPrimary,
    letterSpacing: 0.5
  },
  totalValue: { 
    fontFamily: Theme.fonts.bold,
    fontSize: 18, 
    color: Theme.colors.textPrimary 
  },
  remarksWrapper: {
    paddingHorizontal: Theme.spacing.m,
    marginBottom: Theme.spacing.s
  },
  remarksInputField: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    fontFamily: Theme.fonts.regular,
    height: 100,
    borderRadius: 0
  },
  bottomBuffer: {
    height: Theme.spacing.xl
  }
});