import { useStorageState } from "@/hooks/useStorageState";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { KEYS } from "@/constants/keys";

const AuthContext = React.createContext<{
  signIn: (deviceId: string, userId: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: (deviceId: string, userId: string) => {
          SecureStore.setItem(KEYS.DEVICE_ID, deviceId);
          SecureStore.setItem(KEYS.USER_ID, userId);
          setSession(userId);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
