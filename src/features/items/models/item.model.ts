export type ItemSortOption = 'default' | 'rate-asc' | 'rate-desc';

export type Item = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  stockCount: number;
  image: string;
};

export type ItemDetail = Item & {
  details: string[];
};
