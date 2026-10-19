import data from './catalog.json';
import imageManifest from './imageManifest.json';
const images = new Set(imageManifest);
export const categories = data.categories;
export const categoriesById = Object.fromEntries(categories.map(category => [category.id, category]));
export const items = data.items;
export const itemsById = Object.fromEntries(items.map(item => [item.id, item]));
export const imageFor = item => {
  const filename = (item.image === true ? item.name.replaceAll(' ', '_') + '.png' : item.image || '').toLowerCase();
  return images.has(filename) ? filename : null;
};
export const searchItems = query => query.length < 3 ? [] : items.filter(item => !item.isChild && item.categoryId !== 'boxes' && item.name.toLowerCase().includes(query.toLowerCase()));
