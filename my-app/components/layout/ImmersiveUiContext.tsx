"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ImmersiveUiContextValue = {
  immersive: boolean;
  setImmersive: (next: boolean) => void;
};

const ImmersiveUiContext = createContext<ImmersiveUiContextValue>({
  immersive: false,
  setImmersive: () => undefined,
});

export function ImmersiveUiProvider({ children }: { children: ReactNode }) {
  const [immersive, setImmersiveState] = useState(false);
  const setImmersive = useCallback((next: boolean) => {
    setImmersiveState(next);
  }, []);
  const value = useMemo(
    () => ({ immersive, setImmersive }),
    [immersive, setImmersive],
  );
  return (
    <ImmersiveUiContext.Provider value={value}>
      {children}
    </ImmersiveUiContext.Provider>
  );
}

export function useImmersiveUi() {
  return useContext(ImmersiveUiContext);
}
