import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivatePortal from './pages/private';
import PublicPortal from './pages/public';
import Home from './pages/public/Home/Home';


function App() {
  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <AuthGuardRedirect redirectTo="/user/posts">
                <PublicPortal />
            </AuthGuardRedirect>
          }
        />
        <Route
          path="user/*"
          element={
            <RequireAuth redirectTo="/">
              <PrivatePortal />
            </RequireAuth>
          }
        />
        <Route
          path=""
          element={
            <React.Suspense fallback={<></>}>
              <Home />
            </React.Suspense>
          }
        />
      </Routes>
      <ToastContainer 
        hideProgressBar
      />
    </>
  );
}

export default App;

function RequireAuth({ children, redirectTo }) {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  return isAuthenticated ? children : null;
}
function AuthGuardRedirect({ children, redirectTo }) {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Navigate to={redirectTo} /> : children;
}
