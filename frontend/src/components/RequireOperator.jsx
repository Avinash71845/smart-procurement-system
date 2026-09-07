import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireOperator() {
  const location = useLocation();
  const token = localStorage.getItem("OPERATOR_JWT");

  if (!token) {
    return (
      <Navigate
        to="/operator-login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
