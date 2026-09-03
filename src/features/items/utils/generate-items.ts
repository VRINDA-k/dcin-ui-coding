import { Item } from '../models/item.model';

const TOTAL_ITEMS = 48;

export function generateItems(templates: Item[]): Item[] {
  return Array.from({ length: TOTAL_ITEMS }, (_, index) => {
    const template = templates[index % templates.length];
    const variant = Math.floor(index / templates.length) + 1;

    return {
      id: index + 1,
      name: variant === 1 ? template.name : `${template.name} (${variant})`,
      category: template.category,
      price: Number((template.price + (variant - 1) * 4.99).toFixed(2)),
      description: template.description,
      inStock: template.inStock && variant % 3 !== 0,
      stockCount: template.inStock ? Math.max(0, template.stockCount - (variant % 5)) : 0,
      image: template.image,
    };
  });
}

export function getTemplateId(itemId: number, templateCount: number): number {
  return ((itemId - 1) % templateCount) + 1;
}
