import { Store } from "@/interfaces";

  export const stores:Store[] = [
    {
      id: 2,
      name: 'Olive',
      description: 'Zapatos de mujer con estilo y comodidad',
      image: '/placeholder.svg?height=100&width=100',
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
      image: '/placeholder.svg?height=100&width=100',
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
  ];