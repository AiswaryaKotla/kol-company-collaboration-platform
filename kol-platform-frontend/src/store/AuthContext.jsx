import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  //  helper: get registered users
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  //  LOGIN
  const login = async (email, password, role) => {
    await new Promise((res) => setTimeout(res, 400));

    //  ADMIN LOGIN (fixed credentials)
    if (role === "admin") {
      if (email === "admin" && password === "123456789") {
        const adminUser = {
          email: "admin",
          role: "admin",
          name: "Platform Admin",
        };

        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
        return adminUser;
      } else {
        throw new Error("Invalid admin credentials");
      }
    }

    //  KOL /  COMPANY LOGIN
    const users = getUsers();

    const found = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.role === role
    );

    if (!found) {
      throw new Error("Invalid credentials");
    }

    localStorage.setItem("user", JSON.stringify(found));
    setUser(found);
    return found;
  };

  //  REGISTER (NO ADMIN)
  const register = async (formData) => {
    await new Promise((res) => setTimeout(res, 400));

    if (formData.role === "admin") {
      throw new Error("Admin cannot register");
    }

    const users = getUsers();

    //  duplicate email check
    if (users.some((u) => u.email === formData.email)) {
      throw new Error("Email already registered");
    }

    users.push(formData);
    saveUsers(users);

    //  IMPORTANT CHANGE:
    //  DO NOT auto-login after register
    // (this was causing your redirect issues)

    return formData;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;