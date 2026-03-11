import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./axiosConfig";
import Login from './Login';
import Admin from './Admin';
import Empleado from './Empleado';
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/empleado" element={
          <ProtectedRoute rolesPermitidos={["EMPLEADO"]}>
            <Empleado />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;