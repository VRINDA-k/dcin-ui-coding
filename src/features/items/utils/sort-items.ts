import { Item, ItemSortOption } from '../models/item.model';

export function sortItems(items: Item[], sortBy: ItemSortOption): Item[] {
  if (sortBy === 'default') {
    return items;
  }

  const sorted = [...items];

  sorted.sort((a, b) => (sortBy === 'rate-asc' ? a.price - b.price : b.price - a.price));

  return sorted;
}
