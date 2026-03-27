import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./axiosConfig";
import Login from './Login';
import Admin from './Admin';
import Empleado from './Empleado';
import ProtectedRoute from "./ProtectedRoute";
import LandinPage from './LandinPage'; 
import Clientes from './Clientes';
import CocinaTV from './CocinaTV';
import SeguimientoPedido from './SeguimientoPedido';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandinPage />} />  
        <Route path="/cocina" element={<CocinaTV />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/seguimiento/:id" element={<SeguimientoPedido />} />
        <Route path="/login"  element={<Login />} />         
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