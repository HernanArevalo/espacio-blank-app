import { Prisma } from "@prisma/client";

export type UserWithStores = Prisma.UserGetPayload<{
  include: {
    storesIds: {
      include: {
        store: true;
      };
    };
  };
}>;

export type StoreWithProductsAndSales = Prisma.StoreGetPayload<{
  include: {
    products: true;
    sales: { include: { items: true }}
  };
}>;
