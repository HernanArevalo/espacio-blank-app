import { Product } from './product.interface';
import { Sale } from './sale.interface';

export interface Store {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  discountTarjeta: number;
  discountTransferencia: number;
  discountEfectivo: number;
  products?: Product[] | null;
  sales?: Sale[] | null;
}
