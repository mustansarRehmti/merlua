export interface TenantState {
  activeSlug: string | null;
  businessName: string | null;
}

export interface SetTenantPayload {
  slug: string;
  businessName?: string | null;
}
