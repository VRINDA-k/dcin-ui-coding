import { Item } from '../models/item.model';

export function filterItems(items: Item[], nameQuery: string, inStockOnly: boolean): Item[] {
  const query = nameQuery.trim().toLowerCase();

  return items.filter((item) => {
    if (inStockOnly && !item.inStock) {
      return false;
    }

    if (!query) {
      return true;
    }

    return item.name.toLowerCase().includes(query);
  });
}
