import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
function App() {
  return (
    <>
      <h1 className="text-xl text-gray-900 font-bold">Kanban Board</h1>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/boards" element={<Boards />} />
      </Routes>
    </>
  );
}

export default App;
