

export function getSales () {

  return [
    {
      id: 1,
      storeId: 1,
      date: '2025-07-16',
      client: "Juana de Arco",
      total: 50000,
      paymentMethod: 'efectivo',
      items: [
        {
          productId: 4,
          quantity: 2,
          price: 15000,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
        },
        {
          productId: 7,
          quantity: 1,
          price: 20000,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
        },
      ],
    }
  ]
}