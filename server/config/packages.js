// config/packages.js
export const packageRules = {
  silver: { pricePerHead: 100, limits: { starters: 2, mainCourse: 2, salads: 2, desserts: 2, drinks: 2, beverages:2 } },
  gold:   { pricePerHead: 150, limits: { starters: 3, mainCourse: 3, salads: 3, desserts: 3, drinks: 3, beverages:3 } },
  custom: { pricePerHead: 0, limits: {} },
};
