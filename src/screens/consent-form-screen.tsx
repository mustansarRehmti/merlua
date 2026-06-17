import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BookingLayout } from '../components/booking-layout';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectDraftCatalogItem,
  selectDraftCustomerDetails,
  selectDraftSignedConsents,
} from '../features/booking/booking-draft.selectors';
import { upsertSignedConsent } from '../features/booking/booking-draft.slice';
import { getConsentTemplatesFromItem } from '../features/booking/booking-flow.utils';
import { Theme } from '../theme/theme';

export function ConsentFormScreen({ navigation }: any) {
  const dispatch = useAppDispatch();

  const selectedItem = useAppSelector(selectDraftCatalogItem);
  const customerDetails = useAppSelector(selectDraftCustomerDetails);
  const signedConsents = useAppSelector(selectDraftSignedConsents);

  const templates = useMemo(
    () => getConsentTemplatesFromItem(selectedItem),
    [selectedItem],
  );

  const [signatureByTemplateId, setSignatureByTemplateId] = useState<
    Record<string, string>
  >(() =>
    signedConsents.reduce<Record<string, string>>((acc, consent) => {
      acc[consent.templateId] = consent.signatureText;
      return acc;
    }, {}),
  );

  const handleContinue = () => {
    if (templates.length === 0) {
      navigation.navigate('PaymentSummary');
      return;
    }

    const missingTemplate = templates.find(template => {
      const signature = signatureByTemplateId[template.id]?.trim();
      return !signature || signature.length < 2;
    });

    if (missingTemplate) {
      Alert.alert(
        'Consent required',
        `Please sign "${missingTemplate.name}" before continuing.`,
      );
      return;
    }

    templates.forEach(template => {
      dispatch(
        upsertSignedConsent({
          templateId: template.id,
          signatureText: signatureByTemplateId[template.id].trim(),
        }),
      );
    });

    navigation.navigate('PaymentSummary');
  };

  return (
    <BookingLayout
      step={5}
      stepTitle="Consent"
      onBackPress={() => navigation.goBack()}
      onForwardPress={handleContinue}
      forwardLabel="Continue to Payment"
    >
      <ScrollView style={styles.canvas} contentContainerStyle={styles.content}>
        {templates.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No consent required</Text>
            <Text style={styles.emptyText}>
              This booking does not require a consent form. Continue to payment summary.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.introTitle}>Review and sign</Text>
            <Text style={styles.introText}>
              Some services require written consent before the appointment can be confirmed.
            </Text>

            {templates.map(template => (
              <View key={template.id} style={styles.card}>
                <Text style={styles.templateTitle}>{template.name}</Text>

                {!!template.description && (
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                )}

                {!!template.htmlContent && (
                  <View style={styles.contentBox}>
                    <Text style={styles.contentText}>
                      {stripHtml(template.htmlContent)}
                    </Text>
                  </View>
                )}

                <Text style={styles.signatureLabel}>Type your full name as signature</Text>
                <TextInput
                  style={styles.signatureInput}
                  value={signatureByTemplateId[template.id] ?? customerDetails.name}
                  onChangeText={value =>
                    setSignatureByTemplateId(previous => ({
                      ...previous,
                      [template.id]: value,
                    }))
                  }
                  placeholder={customerDetails.name || 'Your full name'}
                  placeholderTextColor={Theme.colors.textSecondary}
                  autoCapitalize="words"
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </BookingLayout>
  );
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
  },
  content: {
    padding: Theme.spacing.m,
  },
  introTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 22,
    color: Theme.colors.textPrimary,
    marginBottom: 8,
  },
  introText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: Theme.spacing.m,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    marginBottom: Theme.spacing.s,
  },
  templateTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 17,
    color: Theme.colors.textPrimary,
  },
  templateDescription: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 19,
    marginTop: 6,
  },
  contentBox: {
    backgroundColor: Theme.colors.softIvory,
    borderWidth: 1,
    borderColor: Theme.colors.warmStone,
    padding: Theme.spacing.s,
    marginTop: Theme.spacing.s,
    maxHeight: 220,
  },
  contentText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textPrimary,
    lineHeight: 20,
  },
  signatureLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Theme.spacing.s,
    marginBottom: 8,
  },
  signatureInput: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 15,
    fontFamily: Theme.fonts.regular,
    fontSize: 15,
    color: Theme.colors.textPrimary,
  },
  emptyCard: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.l,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 18,
    color: Theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
