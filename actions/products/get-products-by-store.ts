import { Product } from '@/interfaces';

export function GetProductsByStore(storeId:number): Product[] {
  const allProducts = [
    {
      name: 'Zapatillas deportivas',
      productId: 1,
      stock: 2,
      storeId: 1,
      price: 15000,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
    },
    {
      name: 'Amoladora INGCO',
      productId: 2,
      storeId: 1,
      stock: 1,
      price: 20000,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
    },
    {
      name: 'Ojotas amarillas',
      productId: 3,
      storeId: 1,
      stock: 2,
      price: 15000,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
    },
    {
      name: 'Crocs Band',
      productId: 4,
      storeId: 1,
      stock: 1,
      price: 20000,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
    },
    {
      name: 'Pantuflas Toy Story',
      productId: 5,
      storeId: 2,
      stock: 2,
      price: 15000,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
    },
    {
      name: 'Bucaneras',
      productId: 6,
      stock: 1,
      storeId: 2,

      price: 20000,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
    },
  ]

  return allProducts.filter(product=> product.storeId == storeId);
}
