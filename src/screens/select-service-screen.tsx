import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingHeader } from '../components/booking-header';
import { ServiceCard } from '../components/service-card';
import { Theme } from '../theme/theme';

const MOCK_EXPERIENCES = [
  {
    id: 'srv-1',
    name: 'Gel Polish Architecture',
    description: 'Precision alignment, advanced clean cuticle execution, edge styling, and complete dual signature clear coat restoration protection.',
    durationMinutes: 45,
    price: 70.00,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=300&auto=format&fit=crop',
    type: 'service',
    addOns: [
      { id: 'addon-1', name: 'Nourishing Therapy Mask', price: 15, durationMinutes: 10 },
      { id: 'addon-2', name: 'Extended French Micro-Paint', price: 25, durationMinutes: 15 }
    ]
  },
  {
    id: 'srv-2',
    name: 'Classic Silhouette Set',
    description: 'Bespoke eye framing treatment optimization using dynamic isolated weight distribution application patterns.',
    durationMinutes: 90,
    price: 135.00,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=300&auto=format&fit=crop',
    type: 'service',
    addOns: [
      { id: 'addon-3', name: 'Premium Long Retention Upgrade', price: 20, durationMinutes: 0 }
    ]
  },
  {
    id: 'pkg-1',
    name: 'The Complete Merlua Curated Ritual',
    description: 'The definitive luxury transformation tier package. Combines our signature architectural nail geometry with an advanced lash styling treatment.',
    durationMinutes: 135,
    price: 185.00,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300&auto=format&fit=crop',
    type: 'package',
    addOns: []
  }
];

export function SelectServiceScreen({ navigation }: any) {
  const [activeFlowType, setActiveFlowType] = useState<'service' | 'package'>('service');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  const handleSelection = (id: string) => {
    setSelectedItemId(id);
    setSelectedAddOnIds([]); // Clear any previous sub selections instantly
  };

  const handleToggleAddOn = (addOnId: string) => {
    setSelectedAddOnIds(prev => 
      prev.includes(addOnId) ? prev.filter(id => id !== addOnId) : [...prev, addOnId]
    );
  };

  const visibleItems = MOCK_EXPERIENCES.filter(item => {
    const matchesType = item.type === activeFlowType;
    const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'left', 'right']}>
      <BookingHeader title="Select Experience" step={1} />

      {/* Segmented Controller Switcher */}
      <View style={styles.switcherWrapper}>
        <TouchableOpacity 
          style={[styles.switcherTab, activeFlowType === 'service' && styles.switcherTabActive]}
          onPress={() => { setActiveFlowType('service'); setSelectedItemId(null); }}
          activeOpacity={0.9}
        >
          <Text style={[styles.switcherTabText, activeFlowType === 'service' && styles.switcherTabTextActive]}>
            Treatments
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.switcherTab, activeFlowType === 'package' && styles.switcherTabActive]}
          onPress={() => { setActiveFlowType('package'); setSelectedItemId(null); }}
          activeOpacity={0.9}
        >
          <Text style={[styles.switcherTabText, activeFlowType === 'package' && styles.switcherTabTextActive]}>
            Studio Packages
          </Text>
        </TouchableOpacity>
      </View>

      {/* Styled Entry Text Box Layer */}
      <View style={styles.searchBoxFrame}>
        <TextInput
          style={styles.inputField}
          placeholder="Filter allocations..."
          placeholderTextColor={Theme.colors.border}
          value={searchFilter}
          onChangeText={setSearchFilter}
          autoCorrect={false}
        />
      </View>

      {/* Primary Scrollable Service List Stack */}
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollListContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ServiceCard
            id={item.id}
            name={item.name}
            description={item.description}
            durationMinutes={item.durationMinutes}
            price={item.price}
            imageUrl={item.imageUrl}
            isSelected={selectedItemId === item.id}
            onPress={() => handleSelection(item.id)}
            addOns={item.addOns}
            selectedAddOnIds={selectedAddOnIds}
            onToggleAddOn={handleToggleAddOn}
            isPackageVariant={item.type === 'package'}
          />
        )}
      />

      {/* Bottom Control Actions Footer */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[styles.primarySubmitBtn, !selectedItemId && styles.primarySubmitBtnDisabled]}
          disabled={!selectedItemId}
          onPress={() => navigation.navigate('SelectStaff')}
          activeOpacity={0.9}
        >
          <Text style={styles.primarySubmitBtnText}>Confirm Specification & Proceed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory
  },
  switcherWrapper: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.m,
    marginTop: Theme.spacing.xs,
    borderWidth: 1,
    borderColor: Theme.colors.luxuryBlack,
    backgroundColor: Theme.colors.white
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  switcherTabActive: {
    backgroundColor: Theme.colors.luxuryBlack
  },
  switcherTabText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textPrimary
  },
  switcherTabTextActive: {
    color: Theme.colors.softIvory
  },
  searchBoxFrame: {
    marginHorizontal: Theme.spacing.m,
    marginTop: Theme.spacing.s,
    marginBottom: Theme.spacing.xs
  },
  inputField: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 14,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    fontFamily: Theme.fonts.regular,
    borderRadius: 0
  },
  scrollListContainer: {
    paddingHorizontal: Theme.spacing.m,
    paddingTop: 12,
    paddingBottom: Theme.spacing.l
  },
  stickyFooter: {
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderTopWidth: 1,
    borderColor: Theme.colors.warmStone,
    backgroundColor: Theme.colors.white
  },
  primarySubmitBtn: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0
  },
  primarySubmitBtnDisabled: {
    backgroundColor: Theme.colors.border,
    opacity: 0.4
  },
  primarySubmitBtnText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2
  }
});