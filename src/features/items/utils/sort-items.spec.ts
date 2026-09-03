import { sortItems } from '@features/items/utils/sort-items';
import { mockItem } from 'src/test-utilities/mocks/item.mock';

describe('sortItems', () => {
  const items = [
    { ...mockItem, id: 1, price: 50 },
    { ...mockItem, id: 2, name: 'Camera', price: 100 },
    { ...mockItem, id: 3, name: 'Watch', price: 25 },
  ];

  it('should return items unchanged for default sort', () => {
    expect(sortItems(items, 'default')).toEqual(items);
  });

  it('should sort by price ascending', () => {
    const sorted = sortItems(items, 'rate-asc');

    expect(sorted.map((item) => item.price)).toEqual([25, 50, 100]);
  });

  it('should sort by price descending', () => {
    const sorted = sortItems(items, 'rate-desc');

    expect(sorted.map((item) => item.price)).toEqual([100, 50, 25]);
  });

  it('should not mutate the original array', () => {
    const originalOrder = items.map((item) => item.id);

    sortItems(items, 'rate-asc');

    expect(items.map((item) => item.id)).toEqual(originalOrder);
  });
});
