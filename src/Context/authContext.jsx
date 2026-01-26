import { createContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoggedUser } from "../Server/UserLoggedApi/UserLoggedApi";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [usertoken, setusertoken] = useState(localStorage.getItem("token"));

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getLoggedUser,
    enabled: !!usertoken, 
  });

  const userData = data?.user || null;


  useEffect(() => {
    if (!usertoken) {
      
    }
  }, [usertoken]);

  return (
    <AuthContext.Provider
      value={{
        usertoken,
        setusertoken,

        userData,

        refetchUser: refetch,
        isAuthLoading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
