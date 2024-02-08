"use client";

import { User } from "@prisma/client";
import { ReactNode, createContext, useContext } from "react";

const CurrentUserContext = createContext<User | null>(null);

export function CurrentUserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const user = useContext(CurrentUserContext);

  return user;
}
