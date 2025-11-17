import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  const store = await prisma.store.findUnique({
    where: { id: Number(params.storeId) },
  });

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }
  console.log(store);

  return NextResponse.json(store);
}
