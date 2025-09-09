import { Role, User } from '@/interfaces';
import { create } from 'zustand';

type Store = {
  loading: boolean;
  setLoading: (value:boolean)=> void;
  user: User | null | any;
  setUser: (newUser: any) => void;
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
    set({
      isLoggedIn: false,
      showAdminPanel: false,
      showVentaModal: false,
      showProductoModal: false,
    });
  },
}));
