import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "../../modules/layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../../modules/login/Login";

import { Home } from "../../modules/home";
import {
  FootXSystem,
  TableroMl,
  Cop3eros,
  CopAdmin,
  AdminTurnos,
} from "../../modules/dashboard";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />

          <Route path="/FootXSystem" element={<FootXSystem />} />
          <Route path="/AdminTurnos" element={<AdminTurnos />} />
          <Route path="/TableroML" element={<TableroMl />} />
          <Route path="/COPAdmin" element={<CopAdmin />} />
          <Route path="/COP3eros" element={<Cop3eros />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export { AppRouter };
