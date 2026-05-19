export type CountryKey = 'peru' | 'ethiopia' | 'colombia' | 'brazil';
export type ProductSlug = 'peru' | 'ethiopia-yirgacheffe' | 'ethiopia-lekempti' | 'colombia' | 'brazil';

export interface Product {
  slug: ProductSlug;
  country: CountryKey;
  region: string;
  name: string;
  fullName: string;
  variety: string;
  flavorEN: string[];
  flavorTR: string[];
  process: string;
  processTR: string;
  altitude: string;
  brew: 'Filter' | 'Espresso';
  brewTR: 'Filtre Kahve' | 'Espresso';
  color: string;
  weight: string;
  price: number;
  // For the hexagon constellation
  hexPosition: 'top' | 'upperRight' | 'lowerRight' | 'lowerLeft' | 'upperLeft';
}

export const PRODUCTS: Record<ProductSlug, Product> = {
  'peru': {
    slug: 'peru',
    country: 'peru',
    region: 'Cajamarca',
    name: 'Peru',
    fullName: 'Peru Cajamarca',
    variety: 'Caturra',
    flavorEN: ['Caramel', 'Hazelnut', 'Citrus'],
    flavorTR: ['Karamel', 'Fındık ve Turunçgiller Notaları'],
    process: 'Washed',
    processTR: 'Yıkanmış',
    altitude: '1400 - 2000m',
    brew: 'Filter',
    brewTR: 'Filtre Kahve',
    color: '#1C4732',
    weight: '250g',
    price: 280,
    hexPosition: 'top',
  },
  'ethiopia-yirgacheffe': {
    slug: 'ethiopia-yirgacheffe',
    country: 'ethiopia',
    region: 'Yirgacheffe',
    name: 'Ethiopia',
    fullName: 'Ethiopia Yirgacheffe',
    variety: 'Arabica',
    flavorEN: ['Bright Acidity', 'Citrus', 'Chocolate'],
    flavorTR: ['Parlak Asidite', 'Narenciye ve Çikolata Notaları'],
    process: 'Washed',
    processTR: 'Yıkanmış',
    altitude: '1700 - 2200m',
    brew: 'Espresso',
    brewTR: 'Espresso',
    color: '#4475D4',
    weight: '250g',
    price: 320,
    hexPosition: 'upperLeft',
  },
  'ethiopia-lekempti': {
    slug: 'ethiopia-lekempti',
    country: 'ethiopia',
    region: 'Lekempti',
    name: 'Ethiopia',
    fullName: 'Ethiopia Lekempti',
    variety: 'Heirlooms',
    flavorEN: ['Floral', 'Sweet Winey', 'Balanced Body'],
    flavorTR: ['Meyvemsi', 'Tatlı Şarap', 'Dengeli', 'Gövdeli Notalar'],
    process: 'Natural',
    processTR: 'Naturel',
    altitude: '1700 - 2200m',
    brew: 'Espresso',
    brewTR: 'Espresso',
    color: '#4475D4',
    weight: '250g',
    price: 320,
    hexPosition: 'lowerRight',
  },
  'colombia': {
    slug: 'colombia',
    country: 'colombia',
    region: 'Supremo Medellin',
    name: 'Colombia',
    fullName: 'Colombia Supremo Medellin',
    variety: 'Arabica',
    flavorEN: ['Walnut', 'Peach', 'Cocoa'],
    flavorTR: ['Ceviz', 'Şeftali ve Kakao Notaları'],
    process: 'Washed',
    processTR: 'Yıkanmış',
    altitude: '1400 - 1600m',
    brew: 'Filter',
    brewTR: 'Filtre Kahve',
    color: '#6B1818',
    weight: '250g',
    price: 280,
    hexPosition: 'upperRight',
  },
  'brazil': {
    slug: 'brazil',
    country: 'brazil',
    region: 'Selection',
    name: 'Brazil',
    fullName: 'Brazil Selection',
    variety: 'Catuai',
    flavorEN: ['Juicy Floral', 'Creamy Milk Chocolate'],
    flavorTR: ['Canlı ve Çiçeksi Aromalar', 'Kremsi Süt Dokusu ve Çikolata Notaları'],
    process: 'Natural',
    processTR: 'Naturel',
    altitude: '1200 - 1400m',
    brew: 'Espresso',
    brewTR: 'Espresso',
    color: '#E89832',
    weight: '250g',
    price: 260,
    hexPosition: 'lowerLeft',
  },
};

export const PRODUCT_LIST: Product[] = Object.values(PRODUCTS);

export function getProduct(slug: string): Product | null {
  return (PRODUCTS as Record<string, Product>)[slug] ?? null;
}

export function getOpposite(slug: ProductSlug): ProductSlug | 'video' {
  // peru ↔ video, ethiopia-yirgacheffe ↔ ethiopia-lekempti, colombia ↔ brazil
  switch (slug) {
    case 'peru': return 'video';
    case 'ethiopia-yirgacheffe': return 'ethiopia-lekempti';
    case 'ethiopia-lekempti': return 'ethiopia-yirgacheffe';
    case 'colombia': return 'brazil';
    case 'brazil': return 'colombia';
  }
}
