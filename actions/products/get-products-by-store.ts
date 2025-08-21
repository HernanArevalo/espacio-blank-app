import { Product } from "@/interfaces";

export function GetProductsByStore (): Product[]  {

  return [
        {
          name: "Zapatillas deportivas",
          productId: 4,
          stock: 2,
          storeId: 1,
          price: 15000,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s'
        },
        {
          name: "Amoladora INGCO",
          productId: 7,
          stock: 1,
          price: 20000,
          storeId: 1,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s'
        },
      ]
}
