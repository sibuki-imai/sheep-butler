// src/auth/Login.tsx
import { useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    await login(idToken);
  };

  const loginWithEmail = async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();
    await login(idToken);
  };

  const login = async (idToken: string) => {
    const result = await axios.post(
      `/api/auth/`,
      {
        id_token: idToken,
      },
      { withCredentials: true },
    );
    if (result.status === 200) {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        margin: "0 auto",
        width: "70%",
        marginLeft: "15%",
      }}
    >
      <h2>ログイン</h2>

      {/* Google ログイン */}
      <button
        onClick={loginWithGoogle}
        style={{
          width: "100%",
          padding: "10px",
          background: "#fff",
          border: "1px solid #dadce0",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          width={18}
          height={18}
          alt="google"
        />
        Googleでログイン
      </button>
      {/* dev */}

      <hr style={{ margin: "20px 0" }} />

      {/* メールログイン */}
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button
        onClick={loginWithEmail}
        style={{
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "#fff",
          borderRadius: 4,
        }}
      >
        メールでログイン
      </button>
    </div>
  );
}

export default Login;
