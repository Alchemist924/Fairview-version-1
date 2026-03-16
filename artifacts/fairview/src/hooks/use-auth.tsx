import { createContext, useContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetCurrentUser, 
  useLoginUser, 
  useRegisterUser, 
  useLogoutUser,
  getGetCurrentUserQueryKey,
  type UserResponse 
} from "@workspace/api-client-react";

interface AuthContextType {
  user: UserResponse | null | undefined;
  isLoading: boolean;
  logout: () => void;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetCurrentUser({
    query: {
      retry: false,
      staleTime: Infinity,
    }
  });

  const logoutMutation = useLogoutUser({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
      }
    }
  });

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      logout: () => logoutMutation.mutate(),
      isLoggingOut: logoutMutation.isPending
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
