import { Routes, Route, NavLink } from "react-router-dom";
import MenuPage from "./features/menu/pages/MenuPage";
import DishDetailPage from "./features/menu/pages/DishDetailPage";
import OrderPage from "./features/menu/pages/OrderPage";

export default function App() {
  return (
    <div>
      <header className="topbar">
        <h1>🍽️ CampusEats Dashboard</h1>
        <nav>
          <NavLink to="/" end>Menu</NavLink>
          <NavLink to="/order">Place Order</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/dish/:id" element={<DishDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="*" element={<p className="status error">404 — Page not found</p>} />
        </Routes>
      </main>
    </div>
  );
}