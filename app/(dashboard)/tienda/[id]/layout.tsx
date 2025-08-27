import { getStoreById } from "@/actions/store";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tienda = getStoreById(params.id)

  return {
    title: tienda?.name || "Tienda no encontrada",
    description: `Bienvenido a la tienda ${tienda?.name}`,
  };
}

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}
