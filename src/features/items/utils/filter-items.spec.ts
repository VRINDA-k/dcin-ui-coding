import { filterItems } from '@features/items/utils/filter-items';
import { mockItem } from 'src/test-utilities/mocks/item.mock';

describe('filterItems', () => {
  const items = [
    mockItem,
    { ...mockItem, id: 2, name: 'Camera', inStock: false },
    { ...mockItem, id: 3, name: 'Watch', inStock: true },
  ];

  it('should return all items when no filters are applied', () => {
    expect(filterItems(items, '', false)).toEqual(items);
  });

  it('should filter by name case-insensitively', () => {
    expect(filterItems(items, 'SUN', false)).toEqual([mockItem]);
  });

  it('should trim the name query before filtering', () => {
    expect(filterItems(items, '  watch  ', false)).toEqual([items[2]]);
  });

  it('should filter in-stock items only', () => {
    const result = filterItems(items, '', true);

    expect(result.every((item) => item.inStock)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('should apply both name and in-stock filters', () => {
    expect(filterItems(items, 'watch', true)).toEqual([items[2]]);
  });
});
