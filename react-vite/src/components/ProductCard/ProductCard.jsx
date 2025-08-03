import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  isProductWishlisted,
} from "../../redux/wishlist";
import "./ProductCard.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlisted = useSelector((state) =>
    isProductWishlisted(product.id)(state)
  );

  const toggleWishlist = () => {
    if (wishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.cover_image_url}
          alt={product.title}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        <Link to={`/products/${product.id}`} className="product-title-link">
          <h3 className="product-title">{product.title}</h3>
        </Link>
        <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>

        <button className="wishlist-button" onClick={toggleWishlist}>
          {wishlisted ? "💔 Remove" : "❤️ Wishlist"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;