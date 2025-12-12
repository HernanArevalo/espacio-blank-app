"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteStoreById(storeId: number) {
  try {
    // 1. Intentamos eliminar la tienda
    // Nota: Si en tu schema.prisma no tienes "onDelete: Cascade" en las relaciones,
    // esto fallará si la tienda tiene productos o ventas.
    
    // Para asegurar el borrado completo (si no tienes cascade en DB), 
    // podrías usar una transacción:
    /*
    await prisma.$transaction(async (tx) => {
        Borrar relaciones primero (ejemplo)
        await tx.product.deleteMany({ where: { storeId } });
        await tx.sale.deleteMany({ where: { storeId } });
        await tx.userStore.deleteMany({ where: { storeId } });
        
        Finalmente borrar la tienda
        await tx.store.delete({ where: { id: storeId } });
    });
    */

    // Versión simple (asumiendo que quieres borrar o que tienes cascade):
    await prisma.store.delete({
      where: { id: storeId },
    });

    // 2. Revalidamos las rutas afectadas
    revalidatePath("/admin");
    revalidatePath("/admin/tiendas");
    revalidatePath("/");

    // 3. Retornamos éxito
    return { ok: true, message: "Tienda eliminada correctamente" };

  } catch (error: any) {
    console.error("Error deleting store:", error);

    // Detección de error de clave foránea (P2003 en Prisma/Postgres)
    if (error.code === 'P2003') {
        return { 
            ok: false, 
            message: "No se puede eliminar: La tienda tiene productos, ventas o usuarios asociados. Debes eliminarlos primero." 
        };
    }

    return { ok: false, message: "Error interno al eliminar la tienda." };
  }
}