import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  isProductWishlisted,
  fetchWishlist,
} from "../../redux/wishlist";

function ProductShowPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch product by ID
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [id]);

  useEffect(() => {
    // Load wishlist on component mount
    dispatch(fetchWishlist());
  }, [dispatch]);

  // If product hasn't loaded yet
  if (!product) return <p>Loading...</p>;

  const isWishlisted = useSelector(
    (state) => isProductWishlisted(product.id)(state)
  );

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  return (
    <div className="product-show-page">
      <div style={{ display: "flex" }}>
        {/* Album photo */}
        <div>
          <img
            src={product.cover_image_url}
            alt={product.title}
            style={{ width: "300px", height: "300px", objectFit: "cover" }}
          />
          <div style={{ marginTop: "10px" }}>
            <button>🛒 Add to Cart</button>
            <button onClick={handleWishlistToggle}>
              {isWishlisted ? "💔 Remove from Wishlist" : "❤️ Add to Wishlist"}
            </button>
          </div>
        </div>

        {/* Album info */}
        <div style={{ marginLeft: "30px" }}>
          <h1>{product.title}</h1>
          <h3>By: {product.seller?.username || "Artist name"}</h3>

          <div>
            <button>▶</button> Featured Track
          </div>

          <h4>Digital Album</h4>
          <div
            style={{
              border: "1px solid gray",
              padding: "10px",
              minWidth: "300px",
            }}
          >
            {product.description}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Reviews</h3>
        <p><em>Be the first</em></p>
        <p>“Feature coming soon”</p>
      </div>
    </div>
  );
}

export default ProductShowPage;