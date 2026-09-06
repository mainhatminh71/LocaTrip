"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuthActions } from "@/components/auth/useAuthActions";
import {
  getWallet,
  type WalletInfo,
} from "@/lib/api/wallet";
import { WALLET_REFRESH_EVENT } from "@/lib/wallet/xu";
import { InsufficientXuModal } from "./InsufficientXuModal";

type WalletContextValue = {
  balance: number | null;
  rate: WalletInfo["rate"] | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue>({
  balance: null,
  rate: null,
  loading: false,
  refresh: async () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuthActions();
  const [balance, setBalance] = useState<number | null>(null);
  const [rate, setRate] = useState<WalletInfo["rate"] | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setBalance(null);
      setRate(null);
      return;
    }
    setLoading(true);
    try {
      const data = await getWallet();
      setBalance(data.balance);
      setRate(data.rate);
    } catch {
      /* keep last known balance; badge stays quiet on transient errors */
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setBalance(null);
      setRate(null);
      return;
    }
    void refresh();
  }, [authLoading, isAuthenticated, refresh]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const onRefresh = () => {
      void refresh();
    };
    window.addEventListener(WALLET_REFRESH_EVENT, onRefresh);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(WALLET_REFRESH_EVENT, onRefresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAuthenticated, refresh]);

  const value = useMemo(
    () => ({ balance, rate, loading, refresh }),
    [balance, rate, loading, refresh],
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
      <InsufficientXuModal />
    </WalletContext.Provider>
  );
}
