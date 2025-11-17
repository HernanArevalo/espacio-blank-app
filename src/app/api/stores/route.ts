"use server";


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const stores = await prisma.store.findMany({
    include: {
      products: true
    }
  });

  return NextResponse.json(stores);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newStore = await prisma.store.create({ data });
  return NextResponse.json(newStore);
}
