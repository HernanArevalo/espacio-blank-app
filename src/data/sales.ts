import { Sale } from '@/interfaces';

export const sales: Sale[] = [
  {
    id: 1,
    storeId: 1,
    date: '2025-08-15T10:32:45.000Z',
    client: 'Juana de Arco',
    total: 50000,
    paymentMethod: 'efectivo',
    items: [
      {
        name: 'Crocs Band',
        productId: 4,
        quantity: 2,
        price: 15000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
      {
        name: 'Bucaneras',
        productId: 7,
        quantity: 1,
        price: 20000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
    ],
  },
  {
    id: 2,
    storeId: 2,
    date: '2025-08-15T14:05:12.123Z',
    client: 'Carlos López',
    total: 30000,
    paymentMethod: 'tarjeta',
    items: [
      {
        name: 'Pantuflas Toy Story',
        productId: 3,
        quantity: 1,
        price: 30000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
    ],
  },
  {
    id: 3,
    storeId: 1,
    date: '2025-08-14T23:47:09.456Z',
    client: 'María González',
    total: 45000,
    paymentMethod: 'transferencia',
    items: [
      {
        name: 'Ojotas amarillas',
        productId: 8,
        quantity: 1,
        price: 25000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
      {
        name: 'Ojotas amarillas',
        productId: 6,
        quantity: 2,
        price: 10000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
    ],
  },
  {
    id: 4,
    storeId: 2,
    date: '2025-08-13T08:15:30.789Z',
    client: 'Pedro Sánchez',
    total: 20000,
    paymentMethod: 'transferencia',
    items: [
      {
        name: 'Zapatillas deportivas',
        productId: 2,
        quantity: 2,
        price: 10000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
    ],
  },
  {
    id: 5,
    storeId: 1,
    date: '2025-08-12T19:22:01.321Z',
    client: 'Lucía Fernández',
    total: 75000,
    paymentMethod: 'tarjeta',
    items: [
      {
        name: 'Zapatillas deportivas',
        productId: 10,
        quantity: 3,
        price: 25000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
    ],
  },
  {
    id: 6,
    storeId: 2,
    date: '2025-08-10T05:59:59.999Z',
    client: 'Miguel Torres',
    total: 60000,
    paymentMethod: 'transferencia',
    items: [
      {
        name: 'Zapatillas deportivas',
        productId: 12,
        quantity: 2,
        price: 30000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
    ],
  },
  {
    id: 7,
    storeId: 1,
    date: '2025-08-09T16:44:20.654Z',
    client: 'Ana Pérez',
    total: 38000,
    paymentMethod: 'efectivo',
    items: [
      {
        name: 'Zapatillas deportivas',
        productId: 9,
        quantity: 1,
        price: 18000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
      {
        name: 'Zapatillas VANS',
        productId: 5,
        quantity: 2,
        price: 10000,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
      },
    ],
  },
];
