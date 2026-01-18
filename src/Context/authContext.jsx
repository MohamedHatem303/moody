import { createContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoggedUser } from "../Server/UserLoggedApi/UserLoggedApi";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  // ✅ التوكن في state
  const [usertoken, setusertoken] = useState(
    localStorage.getItem("token")
  );

  // ✅ react-query (زي ما هو)
  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getLoggedUser,
    enabled: !!usertoken, // 👈 بدل localStorage مباشرة
  });

  const userData = data?.user || null;

  // ✅ لو التوكن اتشال (logout) نعمل cleanup
  useEffect(() => {
    if (!usertoken) {
      // هنا ممكن تزود أي cleanup بعدين
    }
  }, [usertoken]);

  return (
    <AuthContext.Provider
      value={{
        // 🔐 auth
        usertoken,
        setusertoken,

        // 👤 user
        userData,

        // 🔄 react-query
        refetchUser: refetch,
        isAuthLoading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
