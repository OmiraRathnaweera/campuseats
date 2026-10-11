import { Link } from "react-router-dom";

function DishCard({ dish }) {
  return (
    <div className={`dish-card ${dish.available ? "" : "dish-card--soldout"}`}>
      <span className="tag">{dish.category}</span>
      <h3>
        <Link to={`/dish/${dish.id}`}>{dish.name}</Link>
      </h3>
      <p className="price">Rs. {dish.price.toFixed(2)}</p>
      {!dish.available && <span className="badge-soldout">Sold out</span>}
    </div>
  );
}

export default DishCard;
