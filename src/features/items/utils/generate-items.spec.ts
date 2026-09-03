import { generateItems, getTemplateId } from '@features/items/utils/generate-items';
import { mockItem } from 'src/test-utilities/mocks/item.mock';

describe('generateItems', () => {
  const templates = [mockItem, { ...mockItem, id: 2, name: 'Camera' }];

  it('should generate 48 items from templates', () => {
    expect(generateItems(templates)).toHaveLength(48);
  });

  it('should cycle through templates', () => {
    const items = generateItems(templates);

    expect(items[0].name).toBe('Sunglasses');
    expect(items[1].name).toBe('Camera');
    expect(items[2].name).toBe('Sunglasses (2)');
  });

  it('should assign sequential ids starting at 1', () => {
    const items = generateItems(templates);

    expect(items[0].id).toBe(1);
    expect(items[47].id).toBe(48);
  });
});

describe('getTemplateId', () => {
  it('should map item id to template id', () => {
    expect(getTemplateId(1, 8)).toBe(1);
    expect(getTemplateId(8, 8)).toBe(8);
    expect(getTemplateId(9, 8)).toBe(1);
  });
});
