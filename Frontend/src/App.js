import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ResetPassword from "./components/Auth/ResetPassword";

function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return (
    <Layout>
      <Routes>
        {isLoggedIn && <Route path="/" element={<HomePage />} exact />}
        {!isLoggedIn && <Route path="/" element={<AuthPage />} exact />}
        {!isLoggedIn && (<Route path="/auth" element={<AuthPage />} />)}
        {isLoggedIn && <Route path="/profile" element={<UserProfile />} />}
        {!isLoggedIn && <Route path="/resetpassword/:token" element={<ResetPassword />} />}
        <Route path="*" element={<Navigate replace to="/"/>} />
      </Routes>
    </Layout>
  );
}

export default App;
