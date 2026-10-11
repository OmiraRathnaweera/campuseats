import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

function DishDetailPage() {
  const { id } = useParams(); // from /dish/:id
  const { data: dishes, isLoading, error } = useFetch("/menu.json");

  if (isLoading) return <p className="status">Loading dish…</p>;
  if (error)
    return <p className="status error">Could not load dish: {error}</p>;

  const dish = dishes.find((d) => d.id === Number(id));

  if (!dish) {
    return (
      <div className="detail-card">
        <p>Dish #{id} not found.</p>
        <Link className="back-link" to="/">
          ← Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-card">
      <span className="tag">{dish.category}</span>
      <h2>{dish.name}</h2>
      <p className="price">Rs. {dish.price.toFixed(2)}</p>
      <p className={dish.available ? "available" : "unavailable"}>
        {dish.available ? "✔ Available" : "✖ Sold out"}
      </p>
      <Link className="back-link" to="/">
        ← Back to menu
      </Link>
    </div>
  );
}

export default DishDetailPage;
