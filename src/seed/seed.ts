interface SeedProduct {
  name: string;
  productId: number;
  description?: string;
  image: string;
  price: number;
  stock: number;
  storeId: number;
}

type ValidRoles = 'admin' | 'owner' | 'seller' | 'user';

interface SeedUser {
  name: string;
  email: string;
  image?: string;
  role: ValidRoles;
  storesIds: number[];
}

interface SeedStore {
  id: number;
  name: string;
  description: string | null;
  image?: string;
  discounts: {
    tarjeta: number;
    transferencia: number;
    efectivo: number;
  };
  products: SeedProduct[];
}

interface SeedData {
  users: SeedUser[];
  products: SeedProduct[];
  stores: SeedStore[];
}

export const initialData: SeedData = {
  users: [
    {
      name: 'Hernán Arévalo',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocJB9AVV5Os3ukiYGdAOK3H1iY-mkQ1kxF79DLfzcDaFJql1BJ0=s96-c',
      email: 'hernanarevalo16@gmail.com',
      role: 'admin',
      storesIds: [],
    },
  ],
  products: [
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
      name: 'Ojotas amarillas',
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
  ],
  stores: [
    {
      id: 2,
      name: 'Olive',
      description: 'Zapatos de mujer con estilo y comodidad',
      image: '/store-olive.jpg',
      discounts: {
        tarjeta: 1,
        transferencia: 0.95,
        efectivo: 0.85,
      },
      products: [
        {
          productId: 201,
          storeId: 2,
          name: 'Sandalia Olive Summer',
          description: 'Sandalia cómoda con diseño minimalista para el verano',
          price: 22000,
          stock: 12,
          image:
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
        },
        {
          productId: 202,
          storeId: 2,
          name: 'Bota Olive Classic',
          description: 'Bota de cuero negra, ideal para días fríos',
          price: 35000,
          stock: 6,
          image:
            'https://images.unsplash.com/photo-1614251058788-69e675d023af?w=500&q=80',
        },
        {
          productId: 203,
          storeId: 2,
          name: 'Zapatilla Olive Urban',
          description: 'Zapatilla urbana blanca, perfecta para uso diario',
          price: 28000,
          stock: 15,
          image:
            'https://images.unsplash.com/photo-1600180758895-4b8b81ef4a1e?w=500&q=80',
        },
      ],
    },
    {
      id: 1,
      name: 'Oeste Gafas',
      description: 'Tienda para tus gafas',
      image: '/store-oeste.jpg',
      discounts: {
        tarjeta: 1,
        transferencia: 0.9,
        efectivo: 0.8,
      },
      products: [
        {
          productId: 101,
          storeId: 1,
          name: 'Gafa modelo Vintage',
          description: 'Estilo retro con marco metálico',
          price: 15000,
          stock: 10,
          image:
            'https://images.unsplash.com/photo-1549921296-3a013d2decc3?w=500&q=80',
        },
        {
          productId: 102,
          storeId: 1,
          name: 'Gafa deportiva',
          description: 'Ideal para actividades al aire libre',
          price: 18000,
          stock: 8,
          image:
            'https://images.unsplash.com/photo-1605089312926-d5c93a4d3b45?w=500&q=80',
        },
        {
          productId: 103,
          storeId: 1,
          name: 'Gafa polarizada',
          description: 'Protección UV y reducción de reflejos',
          price: 20000,
          stock: 5,
          image:
            'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&q=80',
        },
      ],
    },
  ],
};
