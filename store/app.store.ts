import { Role, User, Store as StoreInterface, Sale } from '@/interfaces';
import { create } from 'zustand';

type Store = {
  user: User | null | any;
  setUser: (newUser: any) => void;
  stores: StoreInterface[];
  sales: Sale[];
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;

  showVentaModal: boolean;
  setShowVentaModal: (state: boolean) => void;

  showProductoModal: boolean;
  setShowProductoModal: (state: boolean) => void;

  showAdminPanel: boolean;
  setShowAdminPanel: (newState: boolean) => void;

  handleLogout: () => void;
};

export const useStore = create<Store>()((set, get) => ({
  loading: false,
  setLoading: (value)=> {
    set({ loading: value });
  },

  user: null,
  setUser: (newUser: any) => {
    set({ user: newUser });
  },

  stores: [
    {
      id: 1,
      name: 'Oeste Gafas',
      description: 'Tienda para tus gafas',
      logo: '/placeholder.svg?height=100&width=100',
      discounts: {
        tarjeta: 1,
        transferencia: 0.9,
        efectivo: 0.8,
      },
      products: [
        {
          id: 101,
          storeId: 1,
          name: 'Gafa modelo Vintage',
          description: 'Estilo retro con marco metálico',
          price: 15000,
          stock: 10,
          image:
            'https://images.unsplash.com/photo-1549921296-3a013d2decc3?w=500&q=80',
        },
        {
          id: 102,
          storeId: 1,
          name: 'Gafa deportiva',
          description: 'Ideal para actividades al aire libre',
          price: 18000,
          stock: 8,
          image:
            'https://images.unsplash.com/photo-1605089312926-d5c93a4d3b45?w=500&q=80',
        },
        {
          id: 103,
          storeId: 1,
          name: 'Gafa polarizada',
          description: 'Protección UV y reducción de reflejos',
          price: 20000,
          stock: 5,
          image:
            'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&q=80',
        },
      ],
    },
    {
      id: 2,
      name: 'Olive',
      description: 'Zapatos y más',
      logo: '/placeholder.svg?height=100&width=100',
      discounts: {
        tarjeta: 1,
        transferencia: 0.9,
        efectivo: 0.8,
      },
      products: [
        {
          id: 201,
          storeId: 2,
          name: 'Zapato de cuero',
          description: 'Elegante y cómodo para uso diario',
          price: 25000,
          stock: 12,
          image:
            'https://images.unsplash.com/photo-1600181956920-b3751c0c0b0a?w=500&q=80',
        },
        {
          id: 202,
          storeId: 2,
          name: 'Zapatilla urbana',
          description: 'Cómoda y liviana para ciudad',
          price: 18000,
          stock: 15,
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        },
        {
          id: 203,
          storeId: 2,
          name: 'Bota de invierno',
          description: 'Calidez y estilo para climas fríos',
          price: 30000,
          stock: 6,
          image:
            'https://images.unsplash.com/photo-1600181957036-70bfa7a9c3a2?w=500&q=80',
        },
      ],
    },
  ],
  sales: [
    {
      id: 1,
      storeId: 1,
      date: '2025-07-16',
      total: 50000,
      paymentMethod: 'cash',
      items: [
        {
          productId: 4,
          quantity: 2,
          price: 15000,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
        },
        {
          productId: 7,
          quantity: 1,
          price: 20000,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
        },
      ],
    },
    {
      id: 1,
      storeId: 2,
      date: '2025-07-16',
      total: 50000,
      paymentMethod: 'cash',
      items: [
        {
          productId: 4,
          quantity: 2,
          price: 15000,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
        },
        {
          productId: 7,
          quantity: 1,
          price: 20000,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GOhUXbTBGraHVj2z0UFnXvCcTRBsY_hXBg&s',
        },
      ],
    },
  ],

  isLoggedIn: false,
  setIsLoggedIn: (state) => {
    set({ isLoggedIn: state });
  },

  showVentaModal: false,
  setShowVentaModal: (state) => {
    set({ showVentaModal: state });
  },

  showProductoModal: false,
  setShowProductoModal: (state) => {
    set({ showProductoModal: state });
  },

  showAdminPanel: false,
  setShowAdminPanel: (newState) => {
    set({ showAdminPanel: newState });
  },

  handleLogin: (role: Role) => {
    const user = get().user;
    set({
      isLoggedIn: true,
    });
  },

  handleLogout: () => {
    get().setIsLoggedIn(false);
    get().setShowAdminPanel(false);
    get().setShowVentaModal(false);
    get().setShowProductoModal(false);
  },
}));
