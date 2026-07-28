export const strapiQueries = {
  cars: "/api/cars?populate=*",
  carBySlug: (slug: string) =>
    `/api/cars?filters[slug][$eq]=${slug}&populate=*`,
  siteSettings: "/api/site-settings?populate=*",
};
