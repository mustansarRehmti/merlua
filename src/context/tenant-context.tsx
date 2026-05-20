import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TenantContextType {
  activeSlug: string | null;
  businessName: string | null;
  setTenant: (slug: string, name?: string) => void;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  const setTenant = (slug: string, name?: string) => {
    // Sanitize slug to matching lowercase format standard (e.g. "Hera's Salon" -> "heras-salon")
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setActiveSlug(formattedSlug);
    if (name) setBusinessName(name);
  };

  const clearTenant = () => {
    setActiveSlug(null);
    setBusinessName(null);
  };

  return (
    <TenantContext.Provider value={{ activeSlug, businessName, setTenant, clearTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within a TenantProvider');
  return context;
}