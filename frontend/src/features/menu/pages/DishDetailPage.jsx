import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { getApiUrl } from "../../../config/api";

function DishDetailPage() {
  const { id } = useParams(); // from /dish/:id
  const { data: dish, isLoading, error } = useFetch(getApiUrl(`/api/menu/${id}`));

  if (isLoading) return <p className="status">Loading dish…</p>;

  if (error || !dish) {
    return (
      <div className="detail-card">
        <p>{error ? `Could not load dish: ${error}` : `Dish #${id} not found.`}</p>
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
      <p className="price">Rs. {Number(dish.price).toFixed(2)}</p>
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
