import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import MenuList from "../components/MenuList";
import { getApiUrl } from "../../../config/api";

function MenuPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);

  // Read backend API endpoint configured via VITE_API_URL environment variable
  const { data: dishes, isLoading, error } = useFetch(getApiUrl("/api/menu"));

  if (isLoading) return <p className="status">Loading menu…</p>;

  if (error)
    return <p className="status error">Could not load menu: {error}</p>;

  const filtered = (dishes || []).filter((d) =>
    d.name?.toLowerCase().includes(debounced.toLowerCase()),
  );

  return (
    <div>
      <input
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search dishes..."
      />
      <MenuList dishes={filtered} />
    </div>
  );
}

export default MenuPage;
