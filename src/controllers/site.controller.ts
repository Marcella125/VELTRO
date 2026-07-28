import { SiteSettings } from "@/models/site-settings.model";

const settings: SiteSettings = {
  siteName: "Platinum",
  tagline: "Luxury vehicles curated for night drives and boardroom arrivals.",
  contactEmail: "concierge@platinumrental.com",
  phone: "+1 (555) 011-4200",
};

export const siteController = {
  getSettings: async (): Promise<SiteSettings> => settings,
};
