import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const sales = await prisma.sale.findMany();
  return NextResponse.json(sales);
}
