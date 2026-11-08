import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import Board from "./pages/Board";
import ProtectedLayout from "./components/ProtectedLayout";
function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:id" element={<Board />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
