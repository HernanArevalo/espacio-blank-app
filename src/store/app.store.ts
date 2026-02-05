import { Role, Sale, User, Store as StoreInterface } from "@prisma/client";
import { create } from 'zustand';

type Store = {
  // 🔹 Estado general / UI
  loading: boolean;
  setLoading: (value: boolean) => void;

  // 🔹 Usuario
  user: User | null;
  setUser: (newUser: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;

  // 🔹 UI modals
  showVentaModal: boolean;
  setShowVentaModal: (state: boolean) => void;
  showProductoModal: boolean;
  setShowProductoModal: (state: boolean) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (state: boolean) => void;

  // 🔹 Data global
  stores: StoreInterface[];
  sales: Sale[];
  fetchStores: () => Promise<void>;
  fetchSales: () => Promise<void>;

  // 🔹 Funciones de sesión
  handleLogout: () => void;
};

export const useStore = create<Store>((set, get) => ({
  // base status
  loading: true,
  setLoading: (value) => set({ loading: value }),

  // user
  user: null,
  setUser: (newUser) => set({ user: newUser }),
  isLoggedIn: false,
  setIsLoggedIn: (state) => set({ isLoggedIn: state }),

  // modals
  showVentaModal: false,
  setShowVentaModal: (state) => set({ showVentaModal: state }),
  showProductoModal: false,
  setShowProductoModal: (state) => set({ showProductoModal: state }),
  showAdminPanel: false,
  setShowAdminPanel: (state) => set({ showAdminPanel: state }),

  // global data
  stores: [],
  sales: [],
  fetchStores: async () => {
    try {
      set({ loading: true });
      const res = await fetch("/api/stores");
      const data = await res.json();
      set({ stores: data, loading: false });
    } catch (error) {
      console.error("Error fetching stores:", error);
      set({ loading: false });
    }
  },
  fetchSales: async () => {
    try {
      set({ loading: true });
      const res = await fetch("/api/sales");
      const data = await res.json();
      set({ sales: data, loading: false });
    } catch (error) {
      console.error("Error fetching sales:", error);
      set({ loading: false });
    }
  },

  // Logout
  handleLogout: () => {
    set({
      isLoggedIn: false,
      showAdminPanel: false,
      showVentaModal: false,
      showProductoModal: false,
      user: null,
    });
  },
}));
