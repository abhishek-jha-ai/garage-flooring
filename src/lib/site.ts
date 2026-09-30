/** Business facts in one place. Everything here is sourced from titangarage.org / BBB listing. */
export const site = {
  name: "Titan Garage Flooring",
  shortName: "Titan Garage",
  tagline: "Epoxy & Polyaspartic Floor Coatings",
  serviceArea: "Serving Bradenton & Surrounding Areas",
  phoneDisplay: "(941) 800-1997",
  phoneHref: "tel:+19418001997",
  email: "titangaragecoating@gmail.com",
  address: {
    street: "5107 Lena Rd, Unit 111",
    city: "Bradenton",
    region: "FL",
  },
  areas: ["Bradenton", "Sarasota", "Englewood"],
  rating: { value: "5.0", count: 148, source: "Google" },
  reviewsUrl: "https://www.google.com/search?q=Titan+Garage+Flooring+Bradenton+reviews",
  social: {
    instagram: "https://www.instagram.com/titangarageofficial",
    facebook: "https://www.facebook.com/titangarageofficial",
  },
  // Override with NEXT_PUBLIC_SITE_URL when the site is connected to its final domain.
  url: "https://garage-flooring-two.vercel.app",
} as const;

export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
