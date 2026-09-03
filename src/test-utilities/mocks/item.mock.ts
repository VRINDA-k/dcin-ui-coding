import { Item, ItemDetail } from '@features/items/models/item.model';

export const mockItem: Item = {
  id: 1,
  name: 'Sunglasses',
  category: 'Accessories',
  price: 79.99,
  description: 'Stylish UV-protection sunglasses for daily wear.',
  inStock: true,
  stockCount: 12,
  image: 'assets/images/sunglasses.jpg',
};

export const mockItemDetail: ItemDetail = {
  ...mockItem,
  details: [
    'UV400 lens protection',
    'Lightweight acetate frame',
    'Polarized lenses',
    'Includes protective case',
  ],
};

export const mockOutOfStockItem: ItemDetail = {
  id: 2,
  name: 'Camera',
  category: 'Electronics',
  price: 499.99,
  description: 'High-resolution digital camera with multiple lenses.',
  inStock: false,
  stockCount: 0,
  image: 'assets/images/camera.jpg',
  details: ['24MP sensor', '4K video recording'],
};
