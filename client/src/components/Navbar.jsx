import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav>
        <div>kanban.</div>

        <div>
          <span>{user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
    </>
  );
}
