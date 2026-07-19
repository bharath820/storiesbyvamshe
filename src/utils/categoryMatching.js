export function normalizeCategoryValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function getCategoryIdentityValues(category) {
  return [category?.id, category?.slug, category?.name]
    .map(normalizeCategoryValue)
    .filter(Boolean);
}

export function getItemCategoryIdentityValues(item) {
  return [item?.categoryId, item?.categorySlug, item?.categoryName, item?.category]
    .map(normalizeCategoryValue)
    .filter(Boolean);
}

export function getPrimaryItemCategoryValue(item) {
  return getItemCategoryIdentityValues(item)[0] || "";
}

export function categoryMatchesValue(category, value) {
  const normalizedValue = normalizeCategoryValue(value);
  return Boolean(normalizedValue) && getCategoryIdentityValues(category).includes(normalizedValue);
}

export function itemMatchesCategory(item, category) {
  const itemCategoryValue = getPrimaryItemCategoryValue(item);
  const categoryValues = new Set(getCategoryIdentityValues(category));
  return Boolean(itemCategoryValue) && categoryValues.has(itemCategoryValue);
}

export function findItemCategory(item, categories) {
  return categories.find((category) => itemMatchesCategory(item, category)) || null;
}

export function buildCategoryNameLookup(categories) {
  const lookup = new Map();
  categories.forEach((category) => {
    getCategoryIdentityValues(category).forEach((value) => {
      lookup.set(value, category.name);
    });
  });
  return lookup;
}

export function getItemCategoryName(item, categoryNameLookup, fallback = "General") {
  const itemCategoryValue = getPrimaryItemCategoryValue(item);
  return itemCategoryValue && categoryNameLookup.has(itemCategoryValue)
    ? categoryNameLookup.get(itemCategoryValue)
    : fallback;
}
