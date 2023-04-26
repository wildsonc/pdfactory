import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../services/api";

interface Login {
  email: string;
  password: string;
}

interface Props {
  signed: boolean;
  user: object | null;
  loading: boolean;
  UpdateUser: (values: object) => void;
  Login: ({ email, password }: Login) => Promise<void>;
  Logout: () => void;
}

const AuthContext = createContext<Props>({} as Props);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storageUser = Cookies.get("user");
    const storageToken = Cookies.get("refreshToken");

    if (storageUser && storageToken) {
      setUser(JSON.parse(storageUser));
    }
    setLoading(false);
  }, []);

  const UpdateUser = async (values: object) => {
    api.put("/auth/user/", values).then((res) => {
      setUser(res.data);
      Cookies.set("user", JSON.stringify(res.data));
    });
  };

  const Login = async ({ email, password }: Login) => {
    return api
      .post("/auth/login/", {
        email: email,
        password: password,
      })
      .then((res) => {
        api.defaults.headers.common["Authorization"] = "Bearer " + res.data.access_token;
        Cookies.set("accessToken", res.data.access_token);
        Cookies.set("refreshToken", res.data.refresh_token);
        Cookies.set("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      });
  };

  const Logout = async () => {
    try {
      await api.post("/auth/logout/");
    } catch (err) {
      console.error(err);
    }
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");
    Cookies.remove("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, Login, Logout, UpdateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
