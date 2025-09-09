import { stores } from '@/data';
import { Store } from '@/interfaces';

export function getStoreById(storeId: number|string): Store|undefined {


  const storeFinded = stores.find(store => store.id == storeId)

  return storeFinded;
}
