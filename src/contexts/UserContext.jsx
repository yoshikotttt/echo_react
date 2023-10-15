import { createContext, useContext, useState } from "react";

const UserContext = createContext();


export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log(user); // ログにuserの現在の値を出力

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
