import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import ProtectedLayout from "./components/ProtectedLayout";
function App() {
  return (
    <>
      <h1 className="text-xl text-gray-900 font-bold">Kanban Board</h1>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/boards" element={<Boards />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
