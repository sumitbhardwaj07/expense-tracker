import { Route, Routes, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";

import { useContext } from "react";
import AuthContext from "./store/auth-context";
import HomePage from "./pages/HomePage";
import ContactDetails from "./components/ContactDetails/ContactDetails";




function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Routes>
        {authCtx.isLoggedIn && <Route path="/" element={<HomePage />} exact />}
        {!authCtx.isLoggedIn && <Route path="/" element={<AuthPage />} exact />}
        {!authCtx.isLoggedIn && (<Route path="/auth" element={<AuthPage />} />)}
        {authCtx.isLoggedIn && <Route path="/profile" element={<UserProfile />} />}
        {authCtx.isLoggedIn && <Route path="/contactdetails" element={<ContactDetails />} />}
        <Route path="*" element={<Navigate replace to="/"/>} />
      </Routes>
    </Layout>
  );
}

export default App;
