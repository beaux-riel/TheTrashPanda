/**
 * Maps listing categories and titles to hand-drawn illustration files.
 * These are ink-and-watercolour style images generated to match the Bandit aesthetic.
 * No user uploads required — every listing gets a beautiful default.
 */

const ITEMS_PATH = "/images/listings";

/** Individual item images available */
export const itemImages = {
  tomato: `${ITEMS_PATH}/item-tomato.webp`,
  carrot: `${ITEMS_PATH}/item-carrot.webp`,
  lettuce: `${ITEMS_PATH}/item-lettuce.webp`,
  potato: `${ITEMS_PATH}/item-potato.webp`,
  onion: `${ITEMS_PATH}/item-onion.webp`,
  garlic: `${ITEMS_PATH}/item-garlic.webp`,
  beet: `${ITEMS_PATH}/item-beet.webp`,
  squash: `${ITEMS_PATH}/item-squash.webp`,
  corn: `${ITEMS_PATH}/item-corn.webp`,
  apple: `${ITEMS_PATH}/item-apple.webp`,
  berries: `${ITEMS_PATH}/item-berries.webp`,
  pear: `${ITEMS_PATH}/item-pear.webp`,
  mushroom: `${ITEMS_PATH}/item-mushroom.webp`,
  zucchini: `${ITEMS_PATH}/item-zucchini.webp`,
  eggs: `${ITEMS_PATH}/item-eggs.webp`,
  bread: `${ITEMS_PATH}/item-bread.webp`,
  baguette: `${ITEMS_PATH}/item-baguette.webp`,
  pastry: `${ITEMS_PATH}/item-pastry.webp`,
  jam: `${ITEMS_PATH}/item-jam.webp`,
  pickles: `${ITEMS_PATH}/item-pickles.webp`,
  honey: `${ITEMS_PATH}/item-honey.webp`,
  cheese: `${ITEMS_PATH}/item-cheese.webp`,
  chicken: `${ITEMS_PATH}/item-chicken.webp`,
  fish: `${ITEMS_PATH}/item-fish.webp`,
  steak: `${ITEMS_PATH}/item-steak.webp`,
  herbs: `${ITEMS_PATH}/item-herbs.webp`,
  seedling: `${ITEMS_PATH}/item-seedling.webp`,
  flowers: `${ITEMS_PATH}/item-flowers.webp`,
  soup: `${ITEMS_PATH}/item-soup.webp`,
  pie: `${ITEMS_PATH}/item-pie.webp`,
} as const;

/** Category → default image when no keyword match */
const categoryDefaults: Record<string, string> = {
  Produce: itemImages.carrot,
  Eggs: itemImages.eggs,
  "Baked Goods": itemImages.bread,
  Preserved: itemImages.jam,
  Dairy: itemImages.cheese,
  "Meat & Fish": itemImages.steak,
  Honey: itemImages.honey,
  Plants: itemImages.seedling,
  "Prepared Food": itemImages.soup,
  Market: itemImages.herbs,
  Other: itemImages.flowers,
};

/** Keyword → image mapping for smarter matching */
const keywordMap: [RegExp, string][] = [
  [/tomato/i, itemImages.tomato],
  [/carrot/i, itemImages.carrot],
  [/lettuce|salad|greens|mix/i, itemImages.lettuce],
  [/potato/i, itemImages.potato],
  [/onion/i, itemImages.onion],
  [/garlic/i, itemImages.garlic],
  [/beet/i, itemImages.beet],
  [/squash|pumpkin/i, itemImages.squash],
  [/corn/i, itemImages.corn],
  [/apple/i, itemImages.apple],
  [/berr(?:y|ies)|blueberr|strawberr|raspberr/i, itemImages.berries],
  [/pear/i, itemImages.pear],
  [/mushroom/i, itemImages.mushroom],
  [/zucchini|courgette/i, itemImages.zucchini],
  [/egg/i, itemImages.eggs],
  [/bread|loaf/i, itemImages.bread],
  [/baguette/i, itemImages.baguette],
  [/muffin|scone|pastry|cookie/i, itemImages.pastry],
  [/jam|jelly|preserv/i, itemImages.jam],
  [/pickle|ferment|sauerkraut/i, itemImages.pickles],
  [/honey/i, itemImages.honey],
  [/cheese|dairy|milk/i, itemImages.cheese],
  [/chicken|poultry/i, itemImages.chicken],
  [/fish|salmon|trout|halibut/i, itemImages.fish],
  [/beef|steak|pork|lamb|meat|liver/i, itemImages.steak],
  [/herb|rosemary|thyme|basil|mint/i, itemImages.herbs],
  [/seed|sprout|microgreen|wheatgrass|start/i, itemImages.seedling],
  [/flower|bouquet/i, itemImages.flowers],
  [/soup|stew|broth|chili/i, itemImages.soup],
  [/pie|tart|cobbler/i, itemImages.pie],
  [/kale|chard|spinach/i, itemImages.lettuce],
  [/rhubarb/i, itemImages.beet],
  [/CSA|box|subscription/i, itemImages.carrot],
  [/market/i, itemImages.herbs],
  [/soap|candle/i, itemImages.flowers],
];

/**
 * Get the best illustration for a listing based on its title and category.
 * Tries keyword matching first, then falls back to category default.
 */
export function getListingImage(title: string, category: string): string {
  // Try keyword match against title
  for (const [pattern, image] of keywordMap) {
    if (pattern.test(title)) {
      return image;
    }
  }

  // Fall back to category default
  return categoryDefaults[category] ?? itemImages.carrot;
}
