import { initialData } from './seed';
import prisma from '../lib/prisma';

async function main() {
  // 1. Borrar datos previos en orden correcto
  await prisma.userStore.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const { users, stores, products } = initialData;

  // 2. Crear stores
  for (const store of stores) {
    await prisma.store.create({
      data: {
        id: store.id,
        name: store.name,
        description: store.description,
        image: store.image,
        discountTarjeta: store.discounts.tarjeta,
        discountTransferencia: store.discounts.transferencia,
        discountEfectivo: store.discounts.efectivo,
        products: {
          create: store.products.map((p) => ({
            name: p.name,
            description: p.description,
            image: p.image,
            price: p.price,
            stock: p.stock,
          })),
        },
      },
    });
  }

  // 3. Crear users
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });

    // Vincular stores (many-to-many)
    if (user.storesIds.length > 0) {
      await prisma.userStore.createMany({
        data: user.storesIds.map((storeId) => ({
          userId: createdUser.id,
          storeId,
        })),
      });
    }
  }

  // 4. Crear productos sueltos (los que no vienen anidados en stores)
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        storeId: product.storeId,
      },
    });
  }

  console.log('✅ Seed ejecutado correctamente');
}

(() => {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
})();
