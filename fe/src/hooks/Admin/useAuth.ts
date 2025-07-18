import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { IUser } from "../../interface/auth";

interface AuthContextType {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
