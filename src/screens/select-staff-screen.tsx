import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingHeader } from '../components/booking-header';
import { StaffSelector } from '../components/staff-selector';
import { Theme } from '../theme/theme';

// Mocking strict expert listings returned from your endpoint references
const MOCK_STAFF_DATA = [
  {
    id: 'staff-any',
    name: 'Any Available Professional',
    role: 'Allocates the optimal specialist matching your session choice automatically.',
    isAnyStaffVariant: true
  },
  {
    id: 'stf-101',
    name: 'Elena Rostova',
    role: 'Master Nail Architect & Gel Specialist',
    isAnyStaffVariant: false
  },
  {
    id: 'stf-102',
    name: 'Marcus Vance',
    role: 'Senior Lash Extension Designer',
    isAnyStaffVariant: false
  },
  {
    id: 'stf-103',
    name: 'Sasha Dubois',
    role: 'Editorial Colorist & Technical Director',
    isAnyStaffVariant: false
  }
];

export function SelectStaffScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // Search filter excluding the premium structural placeholder "Any Available Professional" 
  const filteredStaff = MOCK_STAFF_DATA.filter(staff => {
    if (staff.isAnyStaffVariant) return true;
    return staff.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'left', 'right']}>
      {/* Back capability wired to step 2 header */}
      <BookingHeader 
        title="Select Professional" 
        step={2} 
        onBackPress={() => navigation.goBack()} 
      />

      {/* Styled Entry Text Box matching SelectService precisely */}
      <View style={styles.searchBoxFrame}>
        <TextInput
          style={styles.inputField}
          placeholder="Filter available specialists..."
          placeholderTextColor={Theme.colors.border}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
      </View>

      {/* Primary Scrollable Staff Selection Grid */}
      <FlatList
        data={filteredStaff}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollListContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <StaffSelector
            id={item.id}
            name={item.name}
            role={item.role}
            isSelected={selectedStaffId === item.id}
            onSelect={() => setSelectedStaffId(item.id)}
            isAnyStaffVariant={item.isAnyStaffVariant}
          />
        )}
      />

      {/* Unified Bottom Control Actions Footer */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[styles.primarySubmitBtn, !selectedStaffId && styles.primarySubmitBtnDisabled]}
          disabled={!selectedStaffId}
          onPress={() => navigation.navigate('SelectSlot')}
          activeOpacity={0.9}
        >
          <Text style={styles.primarySubmitBtnText}>Confirm Professional & Proceed</Text>
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