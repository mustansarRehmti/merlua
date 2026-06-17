import type { CatalogAddOn, CatalogConsentTemplate, CatalogItem } from '../catalog/catalog.types';

export function getSelectedAddOns(
  allAddOns: CatalogAddOn[],
  selectedAddOnIds: string[],
): CatalogAddOn[] {
  const selected = new Set(selectedAddOnIds);
  return allAddOns.filter(addOn => selected.has(addOn.id));
}

export function getBookingTotalCents(
  selectedItem: CatalogItem | null,
  selectedAddOns: CatalogAddOn[],
): number {
  if (!selectedItem) return 0;

  return (
    selectedItem.priceCents +
    selectedAddOns.reduce((sum, addOn) => sum + addOn.priceCents, 0)
  );
}

export function getBookingDurationMinutes(
  selectedItem: CatalogItem | null,
  selectedAddOns: CatalogAddOn[],
): number {
  if (!selectedItem) return 0;

  return (
    selectedItem.durationMinutes +
    selectedAddOns.reduce((sum, addOn) => sum + addOn.durationMinutes, 0)
  );
}

export function getConsentTemplatesFromItem(
  selectedItem: CatalogItem | null,
): CatalogConsentTemplate[] {
  if (!selectedItem) return [];

  const templates: CatalogConsentTemplate[] = [];
  const seen = new Set<string>();

  const addTemplate = (template?: CatalogConsentTemplate | null) => {
    if (!template?.id || seen.has(template.id)) return;
    seen.add(template.id);
    templates.push(template);
  };

  addTemplate(selectedItem.consentTemplate);

  selectedItem.services?.forEach(service => {
    addTemplate(service.consentTemplate);

    if (service.consentTemplateId && !service.consentTemplate) {
      addTemplate({
        id: service.consentTemplateId,
        name: `${service.name} consent`,
        description: 'Please review and sign before booking this service.',
      });
    }
  });

  if (selectedItem.consentTemplateId && !selectedItem.consentTemplate) {
    addTemplate({
      id: selectedItem.consentTemplateId,
      name: `${selectedItem.name} consent`,
      description: 'Please review and sign before booking this service.',
    });
  }

  return templates;
}
