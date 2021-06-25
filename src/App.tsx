import { auth, firebase } from "./services/firebase";
import { createContext, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { NewRoom } from "./pages/NewRoom";
import { Home } from "./pages/Home";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

function App() {
  const [user, setUser] = useState<User>();

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    console.log(result);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google");
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        <Route path="/" exact component={Home} />
        <Route path="/room/new" component={NewRoom} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
